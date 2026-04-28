import { SessionExperience } from "@/components/SessionExperience";
import { AvatarSelectorModal } from "@/components/session-ui/AvatarSelectorModal";
import { VoiceControlsBar } from "@/components/session-ui/VoiceControlsBar";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <SessionExperience sessionId={id} />
      <AvatarSelectorModal />
      <VoiceControlsBar />
    </>
  );
}
