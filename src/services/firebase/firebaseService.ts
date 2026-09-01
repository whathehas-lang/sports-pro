import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { getFirebaseConfig } from '../auth/firebaseConfig';

const config = getFirebaseConfig();

// Check if actual credentials are provided (i.e. not placeholder)
export const isFirebaseConfigured = 
  config.apiKey && 
  config.apiKey !== 'AIzaSy_demo_key_placeholder';

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(app);
    console.log('[Firebase] Realtime Firestore Initialized Successfully!');
  } catch (err) {
    console.error('[Firebase] Failed to initialize firebase, running in local-only fallback mode:', err);
  }
} else {
  console.warn('[Firebase] Running in local-only fallback mode (API key is placeholder). Configure environment variables in Vercel/local to enable real-time sync with friends!');
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderTier: string;
  senderAvatar: string;
  text: string;
  timeStr: string;
  isVvip?: boolean;
  color?: string;
  timestamp?: any;
}

export const firebaseService = {
  /**
   * Subscribe to real-time updates for a specific room's messages.
   * If Firebase is not configured, it returns a no-op function.
   */
  subscribeToRoomMessages(
    roomId: string, 
    onUpdate: (messages: ChatMessage[]) => void
  ): () => void {
    if (!db) {
      return () => {};
    }

    try {
      const messagesRef = collection(db, 'chat_rooms', roomId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

      return onSnapshot(q, 
        (snapshot) => {
          const msgs: ChatMessage[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            msgs.push({
              id: doc.id,
              senderName: data.senderName || '알수없음',
              senderTier: data.senderTier || '일반 회원',
              senderAvatar: data.senderAvatar || '👤',
              text: data.text || '',
              timeStr: data.timeStr || '',
              isVvip: data.isVvip || false,
              color: data.color || 'text-slate-200',
              timestamp: data.timestamp
            });
          });
          onUpdate(msgs);
        },
        (error) => {
          console.error(`[Firebase] onSnapshot error for room ${roomId}:`, error);
        }
      );
    } catch (err) {
      console.error(`[Firebase] Failed to subscribe to room ${roomId}:`, err);
      return () => {};
    }
  },

  /**
   * Send a message to a specific room in Firestore.
   */
  async sendRoomMessage(roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<string | null> {
    if (!db) {
      return null;
    }

    try {
      const messagesRef = collection(db, 'chat_rooms', roomId, 'messages');
      const docRef = await addDoc(messagesRef, {
        senderName: message.senderName,
        senderTier: message.senderTier,
        senderAvatar: message.senderAvatar,
        text: message.text,
        timeStr: message.timeStr,
        isVvip: message.isVvip || false,
        color: message.color || 'text-slate-200',
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      console.error(`[Firebase] Failed to send message to room ${roomId}:`, err);
      return null;
    }
  }
};
