import type { ProgressEvent } from '../types/index.js';

type MessageListener = (data: ProgressEvent) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Set<MessageListener> = new Set();
  private isExplicitlyClosed = false;
  private currentJobId: string | null = null;
  private serverUrl: string = 'ws://192.168.99.1:8000';
  private reconnectTimer: any = null;

  public setServerUrl(httpUrl: string) {
    this.serverUrl = httpUrl.replace(/^http/, 'ws');
  }

  public connect(jobId: string) {
    this.disconnect();
    this.currentJobId = jobId;
    this.isExplicitlyClosed = false;

    const endpoint = `${this.serverUrl}/api/v1/ws/${jobId}`;

    try {
      this.ws = new WebSocket(endpoint);

      this.ws.onopen = () => {
        console.log(`[WS] Connected for job ${jobId}`);
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed: ProgressEvent = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(parsed));
        } catch (e) {
          console.warn('[WS] Non-JSON message received:', event.data);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[WS] Error:', err);
      };

      this.ws.onclose = () => {
        if (!this.isExplicitlyClosed && this.currentJobId) {
          // Reconnect attempt after 2s
          this.reconnectTimer = setTimeout(() => {
            if (this.currentJobId) this.connect(this.currentJobId);
          }, 2000);
        }
      };
    } catch (e) {
      console.warn('[WS] Failed to initiate WebSocket:', e);
    }
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.currentJobId = null;
  }

  public subscribe(listener: MessageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const wsClient = new WebSocketClient();
