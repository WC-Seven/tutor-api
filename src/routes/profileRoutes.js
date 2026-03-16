const express = require("express");

const { createProfile, getProfile } = require("../controllers/profileController");

const profileRouter = express.Router();

profileRouter.post("/create", createProfile);
profileRouter.get("/:id", getProfile);

module.exports = {
  profileRouter,
};
