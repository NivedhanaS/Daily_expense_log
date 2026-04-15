require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");//allow frontend (React etc.) to access backend

const authRoutes = require("./routes/authRoutes");

const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));