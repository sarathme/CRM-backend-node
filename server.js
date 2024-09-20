const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = require("./app");

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.error("DB Error:", err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
