const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = require("./app");

const port = process.env.PORT || 3000;

let DB;
if (process.env.NODE_ENV === "development") {
  DB = process.env.DATABASE;
}
if (process.env.NODE_ENV === "production") {
  console.log(process.env.DATABASE_PROD);
  DB = process.env.DATABASE_PROD.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );
  console.log(DB);
}
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
