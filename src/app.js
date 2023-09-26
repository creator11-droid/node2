const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Customer = require("./models/customer");

dotenv.config();
const app = express();

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/api/people", async (req, res) => {
  try {
    const result = await Customer.find();
    res.send({ people: result });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.get("/api/people/:id", async (req, res) => {
  console.log({ requestParams: req.params });
  try {
    const { id: customerId } = req.params;

    const customer = await Customer.findById(customerId);

    res.send({ customer });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

app.post("/api/people", async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();

    res.status(201).send({ customer });
  } catch (e) {
    res.status(400).send({ message: "something went wrong" });
  }
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);
    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();
