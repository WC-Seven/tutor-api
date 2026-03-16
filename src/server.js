require("dotenv").config();

const { app } = require("./app");

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`Tutor API running on http://localhost:${port}`);
});
