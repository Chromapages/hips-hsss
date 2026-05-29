import { redirect } from 'next/navigation';

export default async function LobbyPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  redirect(`/join/${groupId}`);
}