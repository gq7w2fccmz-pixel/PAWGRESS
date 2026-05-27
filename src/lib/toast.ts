// ── Pawgress Toast System ─────────────────────────────────────────────────────
// Lightweight event-based toast — kein externer Dependency

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type Listener = (toasts: Toast[]) => void;

class ToastStore {
  private toasts: Toast[] = [];
  private listeners: Listener[] = [];

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.toasts]));
  }

  show(message: string, type: ToastType = "info", duration = 3500) {
    const id = Math.random().toString(36).slice(2);
    this.toasts = [...this.toasts, { id, message, type, duration }];
    this.notify();
    setTimeout(() => this.dismiss(id), duration);
    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  success(msg: string) { return this.show(msg, "success"); }
  error(msg: string)   { return this.show(msg, "error", 5000); }
  info(msg: string)    { return this.show(msg, "info"); }
  warning(msg: string) { return this.show(msg, "warning", 4500); }
}

export const toast = new ToastStore();
