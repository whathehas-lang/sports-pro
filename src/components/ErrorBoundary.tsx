import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-red-400">화면 렌더링 복구 대기 중</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              화면 표시 중 일시적인 데이터 예외가 발생했습니다.<br />
              [새로고침] 버튼을 누르면 정상 화면으로 즉시 복구됩니다.
            </p>
            {this.state.error && (
              <pre className="bg-slate-950 p-3 rounded-lg text-[10px] text-red-300 text-left overflow-x-auto border border-slate-800">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              화면 즉시 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
