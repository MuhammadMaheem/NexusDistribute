import PusherServer from "pusher";

export const pusher = new PusherServer({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "mt1",
  useTLS: true,
});

export async function triggerPusherEvent(
  channel: string,
  event: string,
  data: Record<string, unknown>
) {
  if (!process.env.PUSHER_APP_ID) {
    console.warn("Pusher not configured, skipping event:", event);
    return;
  }

  try {
    await pusher.trigger(channel, event, data);
  } catch (error) {
    console.error("Pusher trigger error:", error);
  }
}
