/**
 * Shared helper to generate a deterministic friendly anonymous handle
 * from a user's ID, to maintain strict anonymity.
 */

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
  
  // Simple deterministic hash of userId
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  
  const adj = adjectives[hash % adjectives.length];
  const anim = animals[(hash >> 4) % animals.length];
  const num = (hash % 9) + 1;
  
  return `${adj}-${anim}-${num}`;
}
