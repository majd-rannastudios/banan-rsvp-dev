import type { MessageChannel, MessageSender, SendInput, SendResult } from "../types";

export function createMockSender(channel: MessageChannel): MessageSender {
  return {
    channel,
    async send(input: SendInput): Promise<SendResult> {
      console.log(`[mock:${channel}] -> ${input.to}: ${input.body.slice(0, 80)}`);
      return { status: "mocked" };
    },
  };
}
