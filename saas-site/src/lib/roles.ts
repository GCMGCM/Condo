import { prisma } from './db';

export type StaffRole = 'SUPPORT' | 'ADMIN';

/**
 * Returns true if the given clerkUserId is a staff member (support or admin).
 */
export async function isStaff(clerkUserId: string) {
  const staff = await prisma.staff.findUnique({ where: { clerkUserId } });
  return !!staff;
}

/**
 * Returns true if the given clerkUserId is an admin.
 */
export async function isAdmin(clerkUserId: string) {
  const staff = await prisma.staff.findUnique({ where: { clerkUserId } });
  return staff?.role === 'ADMIN';
}

/**
 * Ensure a staff row exists for the user.
 */
export async function upsertStaff(clerkUserId: string, role: StaffRole = 'SUPPORT') {
  return prisma.staff.upsert({
    where: { clerkUserId },
    update: { role },
    create: { clerkUserId, role },
  });
}
