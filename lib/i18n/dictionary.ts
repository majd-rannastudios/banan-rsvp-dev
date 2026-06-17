import { commonDictionary } from "./dictionary.common";
import { guestDictionary } from "./dictionary.guest";

/**
 * Flat key -> { en, ar } dictionary. Split into per-domain files
 * (dictionary.guest.ts, dictionary.organizer.ts) as those flows are built;
 * all are re-exported here so `useTranslation` has one combined lookup.
 */
export const dictionary = {
  ...commonDictionary,
  ...guestDictionary,
};

export type DictionaryKey = keyof typeof dictionary;
export type Locale = "en" | "ar";
export type Dir = "ltr" | "rtl";

export const LOCALE_COOKIE = "banan_locale";
export const DEFAULT_LOCALE: Locale = "en";

export function dirForLocale(locale: Locale): Dir {
  return locale === "ar" ? "rtl" : "ltr";
}

export function translate(key: DictionaryKey, locale: Locale): string {
  return dictionary[key][locale];
}
