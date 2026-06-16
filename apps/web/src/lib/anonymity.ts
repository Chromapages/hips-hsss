import { createHmac } from 'node:crypto';
import { requireSecret } from './secrets.js';

const adjectives = [
  'Brave', 'Silent', 'Gentle', 'Kind', 'Calm',
  'Bright', 'Wise', 'Warm', 'Quiet', 'Soft',
  'Swift', 'Hopeful', 'Strong', 'Steady', 'Peaceful',
  'Creative', 'Careful', 'Caring', 'Active', 'Mindful'
];

const animals = [
  'Owl', 'River', 'Fox', 'Deer', 'Bear',
  'Wolf', 'Lion', 'Panda', 'Otter', 'Koala',
  'Hawk', 'Lark', 'Eagle', 'Raven', 'Dolphin',
  'Tiger', 'Squirrel', 'Falcon', 'Robin', 'Heron'
];

export function getAnonymousHandle(userId: string): string {
  if (!userId) return 'Anonymous-Member';
  
  let key: string;
  try {
    key = requireSecret('HANDLE_DERIVATION_KEY');
  } catch {
    key = process.env.HANDLE_DERIVATION_KEY || 'default-fallback-handle-derivation-key-32chars';
  }

  const hmac = createHmac('sha256', key).update(userId).digest();
  const val = hmac.readUInt32BE(0);
  
  const adj = adjectives[val % adjectives.length];
  const anim = animals[(val >> 8) % animals.length];
  const num = (val % 9) + 1;
  
  return `${adj}-${anim}-${num}`;
}
