import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/i18n/context";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
  dirForLocale,
} from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "Banan Inauguration",
  description: "Banan Inauguration · Sept 18–19, 2026",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const initialLocale: Locale = cookieLocale === "ar" ? "ar" : DEFAULT_LOCALE;
  const dir = dirForLocale(initialLocale);

  return (
    <html
      lang={initialLocale}
      dir={dir}
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full bg-surface text-text">
        <LocaleProvider initialLocale={initialLocale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
