const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./../models/userModel");
const users = require("./users");
const Query = require("../models/queryModel");
const queries = require("./query");
const Customer = require("../models/customerModel");
const customers = require("./customer");
const Product = require("../models/productModel");
const products = require("./product");
const Feedback = require("../models/feedbackModel");
const feedbacks = require("./feedback");

dotenv.config();

const DB = process.env.DATABASE_PROD.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

// Add dummy queries to query collection

async function makeQueries() {
  try {
    const customers = await Customer.find();
    const products = await Product.find();

    const customerIds = customers.map((customer) => customer.id);
    const productIds = products.map((product) => product.id);

    const queriesWithCustomerId = queries.map((query) => {
      query.customerId =
        customerIds[Math.floor(Math.random() * customerIds.length)];

      if (query.queryType === "product") {
        query.productId =
          productIds[Math.floor(Math.random() * productIds.length)];
      }
      return query;
    });

    const feedbacksWithProductsAndCustomerIds = feedbacks.map((feedback) => {
      feedback.customerId =
        customerIds[Math.floor(Math.random() * customerIds.length)];
      if (feedback.feedbackType === "product") {
        feedback.productId =
          productIds[Math.floor(Math.random() * productIds.length)];
      }

      return feedback;
    });

    await Query.create(queriesWithCustomerId);
    await Feedback.create(feedbacksWithProductsAndCustomerIds);

    console.log("Queries added successfully");
  } catch (err) {
    console.log(err);
  }

  process.exit();
}

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users);
    await Customer.create(customers);
    await Product.create(products);

    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Query.deleteMany();
    await Customer.deleteMany();
    await Product.deleteMany();
    await Feedback.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--delete") {
  deleteData();
} else if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--importqueries") {
  makeQueries();
} else {
  process.exit();
}
