"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  type DictionaryKey,
  type Dir,
  type Locale,
  LOCALE_COOKIE,
  dirForLocale,
  translate,
} from "./dictionary";

interface LocaleContextValue {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocaleCookie(locale: Locale) {
  // One year, root path — readable by the server layout on next request so
  // there's no flash-of-wrong-language on reload/navigation.
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocaleCookie(next);
    document.documentElement.lang = next;
    document.documentElement.dir = dirForLocale(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: dirForLocale(locale),
      setLocale,
      t: (key: DictionaryKey) => translate(key, locale),
    }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
