import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

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

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Fotosentez simülasyonu hata yakaladı:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-rose-900/60 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-white">
              Bileşen Yüklenirken Bir Hata Oluştu
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              Fotosentez simülasyonunda beklenmedik bir durum gerçekleşti. Sayfayı yenileyerek veya aşağıdaki düğmeye basarak tekrar deneyebilirsiniz.
            </p>

            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sayfayı Yeniden Başlat</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
