const { profilesStore } = require("../store/profilesStore");

function createProfileRecord(input) {
  const now = new Date().toISOString();
  const id = Date.now();

  const profile = {
    id,
    name: input.name.trim(),
    area: input.area.trim(),
    role: input.role.trim(),
    level: input.level.trim().toLowerCase(),
    goals: input.goals.trim(),
    createdAt: now,
    lastUpdated: now,
  };

  profilesStore.set(String(id), profile);

  return profile;
}

function findProfileById(id) {
  return profilesStore.get(String(id)) || null;
}

module.exports = {
  createProfileRecord,
  findProfileById,
};
