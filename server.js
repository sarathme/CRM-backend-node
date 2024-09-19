const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = require("./app");

const port = process.env.PORT || 3000;

const DB = "mongodb://localhost:27017/crm_capstone";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.error("DB Error:", err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
