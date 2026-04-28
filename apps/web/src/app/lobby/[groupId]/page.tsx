import Link from "next/link";

const handles = ["Quiet-River-7", "Blue-Anchor-3", "North-Star-11"];

import { LobbyClient } from "@/components/lobby/LobbyClient";

export default async function LobbyPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  return (
    <main className="grid min-h-screen place-items-center bg-black p-6 text-white overflow-y-auto">
      <LobbyClient groupId={groupId} />
    </main>
  );
}
