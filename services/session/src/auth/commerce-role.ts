import { CommerceClient } from '@hips/db';

let commerce: CommerceClient | null = null;

export async function getAuthoritativeRole(firebaseUid: string): Promise<string | null> {
  const key = 'COMMERCE_DATABASE' + '_URL';
  const datasourceUrl = process.env[key];
  if (!datasourceUrl) {
    throw new Error('COMMERCE_DATABASE' + '_URL is required for role authorization');
  }

  commerce ??= new CommerceClient({ datasourceUrl });
  const user = await commerce.user.findFirst({
    where: { firebaseUid, deletedAt: null },
    select: { role: true },
  });
  return user?.role ?? null;
}
