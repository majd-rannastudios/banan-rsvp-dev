import type { RsvpStatus, TransferChoice } from "@/lib/guest/types";

/**
 * TEMPORARY seeded mock guest list powering the analytics dashboard.
 * TODO(Phase 5): replace with a real `guests` table query once Supabase
 * exists — `computeStats`/`*Data` below should keep working unchanged as
 * long as they're fed objects matching this shape.
 */
export interface MockGuest {
  id: string;
  fullName: string;
  nationality: string;
  partySize: number;
  slotLabel: string;
  transferChoice: TransferChoice;
  rsvpStatus: RsvpStatus;
  /** days before "today" the RSVP was submitted, for the trend chart */
  daysAgo: number;
}

const NAMES = [
  "Abdullah Al-Rashid", "Fatima El-Sayed", "Mohammed Al-Otaibi", "Layla Haddad",
  "Khalid Al-Qahtani", "Nour Mansour", "Sara Al-Dosari", "Tariq Bin Salem",
  "Hessa Al-Faisal", "Omar Khoury", "Reem Al-Subaie", "Yousef Nader",
  "Aisha Al-Harbi", "Ziad Tabbara", "Maha Al-Ghamdi", "Rana Mikati",
  "Faisal Al-Mutairi", "Dana Sharif", "Nasser Al-Shehri", "Lina Abboud",
];
const NATIONALITIES = ["Saudi Arabia", "Egypt", "UAE", "Lebanon", "Kuwait", "Qatar", "Jordan"];
const SLOT_LABELS = ["Fri 18 Sep · 6:00 PM", "Fri 18 Sep · 8:30 PM", "Sat 19 Sep · 6:00 PM", "Sat 19 Sep · 8:30 PM"];
const TRANSFERS: TransferChoice[] = ["none", "shuttle", "vip"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function generateGuests(): MockGuest[] {
  const rand = seededRandom(42);
  const guests: MockGuest[] = [];

  NAMES.forEach((fullName, i) => {
    const statusRoll = rand();
    const rsvpStatus: RsvpStatus =
      statusRoll < 0.1 ? "declined" : statusRoll < 0.35 ? "checked_in" : statusRoll < 0.85 ? "confirmed" : "invited";

    guests.push({
      id: `g${i + 1}`,
      fullName,
      nationality: NATIONALITIES[Math.floor(rand() * NATIONALITIES.length)],
      partySize: 1 + Math.floor(rand() * 4),
      slotLabel: SLOT_LABELS[Math.floor(rand() * SLOT_LABELS.length)],
      transferChoice: TRANSFERS[Math.floor(rand() * TRANSFERS.length)],
      rsvpStatus,
      daysAgo: Math.floor(rand() * 6),
    });
  });

  return guests;
}

export const MOCK_GUESTS: MockGuest[] = generateGuests();
