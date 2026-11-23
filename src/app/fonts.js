import { Fraunces, Public_Sans } from 'next/font/google';

/**
 * Admin typography - matches the storefront
 * -----------------------------------------
 * Display : Fraunces     -> page titles, section headings, KPI numbers
 * Body    : Public Sans  -> tables, forms, buttons, labels
 *
 * The same two families the customer sees on the website, self-hosted by
 * next/font (no request to Google, no layout shift). Fraunces is used without
 * the SOFT / WONK / opsz axes here so the admin bundle stays small.
 */
export const fontDisplay = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const fontBody = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
});
