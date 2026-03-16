const express = require("express");
const cors = require("cors");

const { apiRouter } = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandlers");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(express.json({ limit: "12mb" }));

app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
};
