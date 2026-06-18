import type { MessageChannel, MessageSender } from "./types";
import { createMockSender } from "./senders/mock";

/**
 * One env var per channel, independently swappable. Defaults to "mock" if
 * unset so a fresh environment never accidentally calls a real provider.
 * Real provider branches (twilio, whatsapp_cloud_api, resend) get added
 * here when credentials exist - sendToGuests() below never changes.
 */
function providerFor(channel: MessageChannel): string {
  const envVar = {
    whatsapp: process.env.MESSAGING_WHATSAPP_PROVIDER,
    sms: process.env.MESSAGING_SMS_PROVIDER,
    email: process.env.MESSAGING_EMAIL_PROVIDER,
  }[channel];
  return envVar ?? "mock";
}

export function getSender(channel: MessageChannel): MessageSender {
  const provider = providerFor(channel);
  if (provider !== "mock") {
    console.warn(`Messaging provider "${provider}" for ${channel} not wired up yet, using mock`);
  }
  return createMockSender(channel);
}

export interface BroadcastRecipient {
  guestId: string;
  to: string;
  locale: "en" | "ar";
}

export interface BroadcastResult {
  guestId: string;
  channel: MessageChannel;
  status: string;
  providerMessageId?: string;
  error?: string;
}

export async function sendToGuests(
  recipients: BroadcastRecipient[],
  channels: MessageChannel[],
  body: { en: string; ar: string }
): Promise<BroadcastResult[]> {
  const results: BroadcastResult[] = [];
  for (const recipient of recipients) {
    const text = recipient.locale === "ar" && body.ar ? body.ar : body.en;
    for (const channel of channels) {
      const sender = getSender(channel);
      const result = await sender.send({ to: recipient.to, body: text, locale: recipient.locale });
      results.push({ guestId: recipient.guestId, channel, status: result.status, providerMessageId: result.providerMessageId, error: result.error });
    }
  }
  return results;
}
