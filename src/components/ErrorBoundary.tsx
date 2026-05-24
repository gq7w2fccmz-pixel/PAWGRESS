/**
 * ErrorBoundary – fängt React-Fehler ab und zeigt einen Fallback-Screen
 * Besonders wichtig bei: Supabase Sync, Async Screens, Mobile Instability
 */

import { Component, type ReactNode } from "react";

const F      = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

interface Props  { children: ReactNode; }
interface State  { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary] Caught:", error, info.componentStack);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#0a0a0a", color: "#fff" }}>

        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
            style={{ background: "#ef444418", border: "2px solid #ef444444" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 4L32 30H4L18 4Z" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round"/>
              <line x1="18" y1="14" x2="18" y2="22" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="18" cy="26" r="1.5" fill="#ef4444"/>
            </svg>
          </div>

          <p className="font-black italic text-3xl text-white" style={{ fontFamily: F }}>
            OOPS!
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ein unerwarteter Fehler ist aufgetreten. Deine Daten sind sicher.
          </p>

          {/* Fehler-Details (nur im Dev-Modus) */}
          {import.meta.env.DEV && this.state.error && (
            <div className="w-full rounded-xl p-3 text-left"
              style={{ background: "#111", border: "1px solid #2a2a2a" }}>
              <p className="text-xs text-red-400 font-mono break-all">
                {this.state.error.message}
              </p>
            </div>
          )}

          <button onClick={() => this.handleReset()}
            className="w-full py-4 rounded-2xl font-black text-xl text-white mt-2"
            style={{ background: ORANGE, border: "none", fontFamily: F,
              boxShadow: `0 0 20px ${ORANGE}44` }}>
            ZURÜCK ZUR APP 🐾
          </button>

          <button onClick={() => this.setState({ hasError: false, error: null })}
            className="text-sm text-gray-600"
            style={{ background: "none", border: "none" }}>
            Nochmal versuchen
          </button>
        </div>
      </div>
    );
  }
}
