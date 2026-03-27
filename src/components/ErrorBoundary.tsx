import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorDetails = null;
      try {
        if (this.state.error?.message) {
          errorDetails = JSON.parse(this.state.error.message);
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 text-center">
          <div className="glass p-12 rounded-3xl max-w-lg w-full flex flex-col items-center gap-6">
            <div className="p-4 bg-red-500/10 text-red-500 rounded-full">
              <AlertTriangle size={48} />
            </div>
            
            <h1 className="text-3xl font-serif font-bold text-brand-beige">Something went wrong</h1>
            
            <p className="text-brand-beige/60 font-light">
              {errorDetails ? (
                <>
                  An error occurred during a <strong>{errorDetails.operationType}</strong> operation. 
                  Please check your connection or permissions.
                </>
              ) : (
                "An unexpected error occurred. We're working to fix it."
              )}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-black font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300"
            >
              <RefreshCcw size={18} /> Refresh Page
            </button>
            
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="text-[10px] uppercase tracking-widest text-brand-beige/30 hover:text-brand-beige"
            >
              Try to recover
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
