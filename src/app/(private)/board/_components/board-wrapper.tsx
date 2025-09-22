// app/(private)/board/_components/board-wrapper.tsx
"use client";


import dynamic from "next/dynamic";

const BoardClient = dynamic(() => import("./board-client"), { ssr: false });

export default function BoardWrapper({ initialCards }: { initialCards: any }) {
  return <BoardClient initialCards={initialCards} />;
}
