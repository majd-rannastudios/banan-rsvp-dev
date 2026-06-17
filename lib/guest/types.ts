export type RsvpStatus = "invited" | "confirmed" | "declined" | "checked_in";
export type TransferChoice = "none" | "shuttle" | "vip";

export interface EventSlot {
  id: string;
  dateLabel: { en: string; ar: string };
  timeLabel: { en: string; ar: string };
}

export interface EventInfo {
  name: { en: string; ar: string };
  startsOn: string;
  endsOn: string;
  venueName: { en: string; ar: string } | null;
  slots: EventSlot[];
}

export interface GuestInvite {
  token: string;
  fullName: string;
  partySize: number;
  preferredSlotId: string | null;
  transferChoice: TransferChoice;
  rsvpStatus: RsvpStatus;
  event: EventInfo;
}
