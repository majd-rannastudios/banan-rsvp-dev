import { IBM_Plex_Sans_Arabic, Open_Sans } from "next/font/google";

/**
 * Latin typeface per the Banan Corporate Master Brand Guidelines: Open Sans regular.
 */
export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

/**
 * Arabic typeface swap point. The brand guidelines specify Helvetica Neue LT
 * Arabic, which is an unlicensed commercial font for this project. IBM Plex
 * Sans Arabic is used as a free substitute (closer geometric character than
 * Noto Sans Arabic). When the licensed font arrives, replace this single
 * `next/font/google` call with a `next/font/local` declaration pointing at
 * the licensed files, keeping the exported `variable` name unchanged so no
 * other file needs to change.
 */
export const arabicSub = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic-sub",
  display: "swap",
});

export const fontVariables = `${openSans.variable} ${arabicSub.variable}`;
