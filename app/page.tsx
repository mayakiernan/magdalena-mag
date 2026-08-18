"use client";

import dynamic from "next/dynamic";

const Issue = dynamic(() => import("@/components/Issue"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--stage)]">
      <p className="utility text-[var(--ink-soft)]">Loading issue…</p>
    </div>
  ),
});

export default function Home() {
  return <Issue />;
}
