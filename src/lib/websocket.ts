// src/lib/websocket.ts
type Update = { id: string; price: number };

type Listener = (updates: Update[]) => void;

export class SocketClient {
  url: string;
  ws: WebSocket | null = null;
  listeners = new Set<Listener>();
  reconnectDelay = 1000;
  shouldReconnect = true;
  private buffer: Update[] = [];
  private flushTimer: number | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.ws) return;
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        console.log("ws open");
        this.reconnectDelay = 1000;
      };
      this.ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (Array.isArray(data)) this.handleIncoming(data);
          else this.handleIncoming([data]);
        } catch (e) {
          console.warn("ws parse", e);
        }
      };
      this.ws.onclose = () => {
        this.ws = null;
        if (this.shouldReconnect) {
          setTimeout(() => this.connect(), this.reconnectDelay);
          this.reconnectDelay = Math.min(30000, this.reconnectDelay * 1.5);
        }
      };
      this.ws.onerror = () => {
        console.warn("ws error");
      };
    } catch (e) {
      // if WebSocket cannot connect in dev, just silent
      console.warn("ws connect failed:", e);
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
  }

  handleIncoming(updates: Update[]) {
    this.buffer.push(...updates);
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = window.setTimeout(() => {
      const map = new Map<string, number>();
      this.buffer.forEach((u) => map.set(u.id, u.price));
      const arr = Array.from(map.entries()).map(([id, price]) => ({ id, price }));
      this.buffer = [];
      this.flushTimer = null;
      this.listeners.forEach((l) => l(arr));
    }, 200);
  }

  onUpdates(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  simulateUpdate(update: Update | Update[]) {
    this.handleIncoming(Array.isArray(update) ? update : [update]);
  }
}
