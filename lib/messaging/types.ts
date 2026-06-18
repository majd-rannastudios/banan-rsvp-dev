export type MessageChannel = "whatsapp" | "sms" | "email";

export interface SendInput {
  to: string;
  body: string;
  locale: "en" | "ar";
}

export interface SendResult {
  status: "sent" | "failed" | "mocked";
  providerMessageId?: string;
  error?: string;
}

export interface MessageSender {
  channel: MessageChannel;
  send(input: SendInput): Promise<SendResult>;
}
