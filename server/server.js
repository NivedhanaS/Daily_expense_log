require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");//allow frontend (React etc.) to access backend

const authRoutes = require("./routes/authRoutes");

const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/user", userRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {console.log("MongoDB Atlas Connected");})
  .catch(err => console.log(err));
app.post("/api/ai-insight", async (req, res) => {
  try {
    const { expenses, income } = req.body;

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const savings = income - total;

    let message = "";

    if (savings < 0) {
      message = "You are overspending. Reduce unnecessary expenses.";
    } else if (savings < income * 0.2) {
      message = "You are saving less than recommended. Try saving at least 20%.";
    } else {
      message = "Great job! Your financial health looks good.";
    }

    res.json({ insight: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});