/**
 * ErrorBoundary – Kupfer-Bronze Design
 */
import { Component, type ReactNode } from "react";

const F        = "'Barlow Condensed', sans-serif";
const COPPER   = "#cd7f32";
const COPPER_L = "#e8a050";
const COPPER_G = "rgba(180,100,20,0.3)";
const SURF     = "#131008";
const SURF2    = "#1a1610";
const BORDER   = "rgba(205,127,50,0.2)";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#0a0807", color: "#fff" }}>

        {/* Subtile Metalltextur-Linie oben */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(to right, transparent, ${COPPER}66, ${COPPER_L}88, ${COPPER}66, transparent)`,
        }} />

        <div className="flex flex-col items-center gap-5 text-center max-w-sm w-full">

          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`,
              border: `1.5px solid ${BORDER}`,
              boxShadow: `0 0 32px ${COPPER_G}, inset 0 1px 0 rgba(205,127,50,0.15)`,
            }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 6L36 32H4L20 6Z" stroke={COPPER_L} strokeWidth="2" strokeLinejoin="round"
                fill="rgba(205,127,50,0.1)"/>
              <line x1="20" y1="16" x2="20" y2="24" stroke={COPPER_L} strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="28" r="1.5" fill={COPPER_L}/>
            </svg>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <p className="font-black italic text-4xl text-white" style={{ fontFamily: F }}>
              OOPS!
            </p>
            <p className="text-sm leading-relaxed" style={{ color: COPPER }}>
              Ein unerwarteter Fehler ist aufgetreten.
            </p>
            <p className="text-xs" style={{ color: `${COPPER}99` }}>
              Deine Daten sind sicher.
            </p>
          </div>

          {/* Dev-Fehlerdetails */}
          {import.meta.env.DEV && this.state.error && (
            <div className="w-full rounded-2xl p-3 text-left"
              style={{
                background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`,
                border: `1px solid ${BORDER}`,
              }}>
              <p className="text-xs font-mono break-all" style={{ color: COPPER_L }}>
                {this.state.error.message}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
              className="w-full py-4 rounded-2xl font-black text-xl text-white"
              style={{
                background: `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`,
                border: "none", fontFamily: F,
                boxShadow: `0 0 24px ${COPPER_G}`,
              }}>
              ZURÜCK ZUR APP 🐾
            </button>

            <button onClick={() => this.setState({ hasError: false, error: null })}
              className="text-sm py-2"
              style={{ background: "none", border: "none", color: COPPER, fontFamily: F }}>
              Nochmal versuchen
            </button>
          </div>
        </div>
      </div>
    );
  }
}
