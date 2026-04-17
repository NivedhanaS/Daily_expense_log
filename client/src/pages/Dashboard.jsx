import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const [income, setIncome] = useState(0);
  const [savingGoal, setSavingGoal] = useState(20);

  const [editIncome, setEditIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(0);

  const [editGoal, setEditGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(20);

  const token = localStorage.getItem("token");

  // 🔹 FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("https://daily-expense-log.onrender.com/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 FETCH USER
  const fetchUser = async () => {
    try {
      const res = await axios.get("https://daily-expense-log.onrender.com/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncome(res.data.income || 0);
      setSavingGoal(res.data.savingGoal || 20);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchUser();
  }, []);

  // 🔹 SAVE USER DATA (FIXED)
  const saveUserData = async (newIncome, newGoal) => {
    try {
      const res = await axios.put(
        "https://daily-expense-log.onrender.com/api/user",
        {
          income: newIncome,
          savingGoal: newGoal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ update from backend response
      setIncome(res.data.income);
      setSavingGoal(res.data.savingGoal);

      // optional refresh
      await fetchUser();

      alert("Saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Save failed ❌");
    }
  };

  // 🔹 SAVE INCOME
  const handleSaveIncome = async () => {
    await saveUserData(Number(tempIncome), savingGoal);
    setEditIncome(false);
  };

  // 🔹 SAVE GOAL
  const handleSaveGoal = async () => {
    await saveUserData(income, Number(tempGoal));
    setEditGoal(false);
  };

  // 🔹 ADD EXPENSE
const addExpense = async () => {
  console.log("Trying to add");

  try {
    const res = await axios.post(
      "https://daily-expense-log.onrender.com/api/expenses",
      { amount, category, note, date: new Date() },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("RESPONSE:", res.data); // ✅ now works

    setAmount("");
    setCategory("");
    setNote("");

    fetchExpenses();
  } catch (err) {
    console.log("ADD ERROR:", err.response?.data || err.message);
  }
};

  // 🔹 DELETE
  const deleteExpense = async (id) => {
    try {
      await axios.delete(
        `https://daily-expense-log.onrender.com/api/expenses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 STATS
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const categories = {};
  expenses.forEach((e) => {
    categories[e.category] =
      (categories[e.category] || 0) + Number(e.amount);
  });

  const topCategory =
    Object.keys(categories).length > 0
      ? Object.keys(categories).reduce((a, b) =>
          categories[a] > categories[b] ? a : b
        )
      : "None";

  // 🔹 AI CALCULATION
  const suggestedSavings = (income * savingGoal) / 100;
  const actualSavings = income - total;

  // 🔹 CSV EXPORT
  const exportCSV = () => {
    const rows = [
      ["Amount", "Category", "Note"],
      ...expenses.map((e) => [e.amount, e.category, e.note]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
  };

  return (
    <Layout onExport={exportCSV}>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* 🔹 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-5 rounded-2xl bg-lightCard dark:bg-darkCard shadow">
          <p className="text-gray-400 text-sm">Total Spent</p>
          <h2 className="text-2xl font-bold">₹{total}</h2>
        </div>

        <div className="p-5 rounded-2xl bg-lightCard dark:bg-darkCard shadow">
          <p className="text-gray-400 text-sm">Transactions</p>
          <h2 className="text-2xl font-bold">{expenses.length}</h2>
        </div>

        <div className="p-5 rounded-2xl bg-lightCard dark:bg-darkCard shadow">
          <p className="text-gray-400 text-sm">Top Category</p>
          <h2 className="text-2xl font-bold capitalize">
            {topCategory}
          </h2>
        </div>
      </div>

      {/* 🔹 INCOME + GOAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* INCOME */}
        <div className="p-5 rounded-2xl bg-lightCard dark:bg-darkCard shadow">
          <p className="text-gray-400 text-sm mb-2">Monthly Income</p>

          {editIncome ? (
            <div className="flex gap-2">
              <input
                type="number"
                value={tempIncome}
                onChange={(e) =>
                  setTempIncome(Number(e.target.value))
                }
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 w-full"
              />
              <button
                onClick={handleSaveIncome}
                className="bg-green-500 px-3 rounded text-white"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">₹{income}</h2>
              <button
                onClick={() => {
                  setTempIncome(income);
                  setEditIncome(true);
                }}
                className="text-primary text-sm"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* GOAL */}
        <div className="p-5 rounded-2xl bg-lightCard dark:bg-darkCard shadow">
          <p className="text-gray-400 text-sm mb-2">Saving Goal (%)</p>

          {editGoal ? (
            <div className="flex gap-2">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) =>
                  setTempGoal(Number(e.target.value))
                }
                className="p-2 rounded bg-gray-100 dark:bg-gray-800 w-full"
              />
              <button
                onClick={handleSaveGoal}
                className="bg-green-500 px-3 rounded text-white"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">{savingGoal}%</h2>
              <button
                onClick={() => {
                  setTempGoal(savingGoal);
                  setEditGoal(true);
                }}
                className="text-primary text-sm"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 AI INSIGHT */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-6">
        <h3 className="font-semibold mb-3">AI Financial Insight</h3>

        <p>💰 Income: ₹{income}</p>
        <p>💸 Expenses: ₹{total}</p>
        <p>🎯 Target Savings: ₹{suggestedSavings}</p>
        <p>📈 Actual Savings: ₹{actualSavings}</p>

        {actualSavings < suggestedSavings ? (
          <p className="text-yellow-200 mt-2">
            ⚠️ Below saving goal
          </p>
        ) : (
          <p className="text-green-200 mt-2">
            ✅ You're saving well
          </p>
        )}
      </div>

      {/* 🔹 ADD EXPENSE */}
      <div className="p-5 rounded-xl bg-lightCard dark:bg-darkCard shadow mb-6">
        <p className="font-semibold mb-3">Add Expense</p>

        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="p-2 rounded bg-gray-100 dark:bg-gray-800"
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="p-2 rounded bg-gray-100 dark:bg-gray-800"
          />

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
            className="p-2 rounded bg-gray-100 dark:bg-gray-800"
          />

          <button
            onClick={addExpense}
            className="bg-primary px-4 py-2 rounded text-white"
          >
            Add
          </button>
        </div>
      </div>
    </Layout>
  );
}