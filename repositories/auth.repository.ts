import { prisma } from "@/lib/prisma";

export async function findAdminByEmail(email: string) {
  return prisma.adminUser.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function findAdminById(id: string) {
  return prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function findAdminByIdWithPasswordHash(id: string) {
  return prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });
}

export async function updatePassword(id: string, passwordHash: string) {
  return prisma.adminUser.update({
    where: { id },
    data: { passwordHash },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
