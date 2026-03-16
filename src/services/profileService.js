const { prisma } = require("../lib/prisma");

async function createProfileRecord(input) {
  const profile = await prisma.profile.create({
    data: {
      name: input.name.trim(),
      area: input.area.trim(),
      role: input.role.trim(),
      level: input.level.trim().toLowerCase(),
      goals: input.goals.trim(),
    },
  });

  return serializeProfile(profile);
}

async function findProfileById(id) {
  const normalizedId = normalizeProfileId(id);
  if (!normalizedId) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: normalizedId,
    },
  });

  return profile ? serializeProfile(profile) : null;
}

function normalizeProfileId(id) {
  if (typeof id !== "string" || id.trim() === "") {
    return null;
  }

  try {
    return BigInt(id.trim());
  } catch (_error) {
    return null;
  }
}

function serializeProfile(profile) {
  return {
    id: Number(profile.id),
    name: profile.name,
    area: profile.area,
    role: profile.role,
    level: profile.level,
    goals: profile.goals,
    createdAt: profile.createdAt.toISOString(),
    lastUpdated: profile.updatedAt.toISOString(),
  };
}

module.exports = {
  createProfileRecord,
  findProfileById,
};
