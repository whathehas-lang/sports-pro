import type { MembershipTier } from '../../types/sports';

export interface UserSessionData {
  uid: string;
  name: string;
  email: string;
  tier: MembershipTier;
  createdAt: string;
}

export class AuthService {
  private currentUser: UserSessionData | null = null;
  private storageKey = 'sports_v2_user_session';

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.currentUser = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load user session:', e);
    }
  }

  public getCurrentUser(): UserSessionData | null {
    return this.currentUser;
  }

  public async loginWithSocial(providerName: 'Google' | 'Kakao'): Promise<UserSessionData> {
    console.log(`[AuthService] Logging in with ${providerName}...`);
    const mockUser: UserSessionData = {
      uid: `usr_${Date.now()}`,
      name: `${providerName} 유무료 회원이름`,
      email: `user_${Math.floor(Math.random() * 1000)}@tokeon.com`,
      tier: 'VVIP',
      createdAt: new Date().toISOString()
    };

    this.currentUser = mockUser;
    localStorage.setItem(this.storageKey, JSON.stringify(mockUser));
    return mockUser;
  }

  public async loginWithEmail(email: string, name?: string): Promise<UserSessionData> {
    const user: UserSessionData = {
      uid: `usr_${Date.now()}`,
      name: name || email.split('@')[0] || 'VVIP 팩트회원',
      email,
      tier: 'VVIP',
      createdAt: new Date().toISOString()
    };

    this.currentUser = user;
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    return user;
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.storageKey);
  }
}

export const authService = new AuthService();
