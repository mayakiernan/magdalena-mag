import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://magdalena-mag.vercel.app"),
  title: "Magdalena — Photographer, Writer, Publisher",
  description:
    "Deniz Magdalena — photographer, writer, and publisher. Issue 01 of Magdalena, a leaf-through magazine portfolio.",
  openGraph: {
    title: "Magdalena — Photographer, Writer, Publisher",
    description:
      "Issue 01. A print magazine you leaf through — photography, writing, and publishing by Deniz Magdalena.",
    images: [
      {
        url: "/images/cover.jpg",
        width: 813,
        height: 1024,
        alt: "Magdalena issue cover",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F7F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-[100dvh] bg-[var(--paper)] text-[var(--ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
