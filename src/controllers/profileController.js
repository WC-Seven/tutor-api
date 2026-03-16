const { Prisma } = require("@prisma/client");

const { createProfileRecord, findProfileById } = require("../services/profileService");
const { badRequestError, notFoundError } = require("../utils/httpErrors");

async function createProfile(request, response, next) {
  try {
    const { name, area, role, level, goals } = request.body || {};

    validateRequiredString("name", name);
    validateRequiredString("area", area);
    validateRequiredString("role", role);
    validateRequiredString("level", level);
    validateRequiredString("goals", goals);

    const profile = await createProfileRecord({
      name,
      area,
      role,
      level,
      goals,
    });

    response.status(201).json({
      success: true,
      message: "Perfil criado com sucesso!",
      profile,
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return next(badRequestError("Database is unavailable. Configure DATABASE_URL and run Prisma migrations."));
    }

    next(error);
  }
}

async function getProfile(request, response, next) {
  try {
    const profileId = request.params.id;
    validateRequiredString("id", profileId);

    const profile = await findProfileById(profileId);

    if (!profile) {
      throw notFoundError("Profile not found");
    }

    response.status(200).json(profile);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return next(badRequestError("Database is unavailable. Configure DATABASE_URL and run Prisma migrations."));
    }

    next(error);
  }
}

function validateRequiredString(field, value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw badRequestError(`Missing required field: ${field}`);
  }
}

function isDatabaseUnavailableError(error) {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError
  );
}

module.exports = {
  createProfile,
  getProfile,
};
