import Pusher from "pusher-js";

let _pusherClient: Pusher | null = null;

export function getPusherClient(): Pusher | null {
  // Only initialize in browser, never during SSR
  if (typeof window === "undefined") return null;

  if (!_pusherClient) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    if (!key) return null;

    _pusherClient = new Pusher(key, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
      forceTLS: true,
    });
  }

  return _pusherClient;
}

export const pusherClient = {
  subscribe: (channel: string) => getPusherClient()?.subscribe(channel),
  unsubscribe: (channel: string) => getPusherClient()?.unsubscribe(channel),
  bind: (event: string, callback: (...args: unknown[]) => void) =>
    getPusherClient()?.bind(event, callback),
  unbind: (event: string) => getPusherClient()?.unbind(event),
  disconnect: () => getPusherClient()?.disconnect(),
};
