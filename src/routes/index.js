const express = require("express");

const { profileRouter } = require("./profileRoutes");
const { chatRouter } = require("./chatRoutes");

const apiRouter = express.Router();

apiRouter.use("/profile", profileRouter);
apiRouter.use("/chat", chatRouter);

module.exports = {
  apiRouter,
};
