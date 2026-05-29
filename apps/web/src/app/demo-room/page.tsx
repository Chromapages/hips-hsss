import type { Metadata } from 'next';
import { DemoRoomClient } from './DemoRoomClient';

export const metadata: Metadata = {
  title: 'Demo Session — H.I.P.S. Sanctuary',
  description: 'Experience a sandboxed demo session.',
};

export default function DemoRoomPage() {
  return <DemoRoomClient />;
}
