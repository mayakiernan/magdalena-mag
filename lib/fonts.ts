import {
  Archivo,
  Bodoni_Moda,
  Newsreader,
} from "next/font/google";

/**
 * Single swap point for typefaces.
 * Replace these next/font imports when licensed faces
 * (Suisse Int’l, Söhne, etc.) are available.
 */

export const fontDisplay = Bodoni_Moda({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-bodoni-moda",
  display: "swap",
  axes: ["opsz"],
});

export const fontUtility = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

export const fontBody = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const fontVariables = [
  fontDisplay.variable,
  fontUtility.variable,
  fontBody.variable,
].join(" ");
