import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [budget, setBudget] = useState(5000);

  const token = localStorage.getItem("token");

  // 🔹 FETCH
  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses", {
      headers: { Authorization: token },
    });
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 🔹 ADD
  const addExpense = async () => {
    await axios.post(
      "http://localhost:5000/api/expenses",
      { amount, category, note, date: new Date() },
      { headers: { Authorization: token } }
    );

    setAmount("");
    setCategory("");
    setNote("");
    fetchExpenses();
  };

  // 🔹 DELETE
  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
      headers: { Authorization: token },
    });
    fetchExpenses();
  };

  // 🔹 STATS
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = budget - total;
  const percentUsed = Math.min((total / budget) * 100, 100);

  const categories = {};
  expenses.forEach((e) => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  const topCategory =
    Object.keys(categories).length > 0
      ? Object.keys(categories).reduce((a, b) =>
          categories[a] > categories[b] ? a : b
        )
      : "None";

  // 🔹 INSIGHT
  let insight = "";
  if (total > budget) insight = "⚠️ You exceeded your budget!";
  else if (percentUsed > 75)
    insight = "⚠️ You are close to your budget limit.";
  else insight = "✅ Your spending is under control.";

  // 🔹 PIE
  const pieData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ["#7c6af7", "#22d3ee", "#f87171", "#34d399"],
      },
    ],
  };

  // 🔹 BAR
  const barData = {
    labels: expenses.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map((e) => e.amount),
        backgroundColor: "#7c6af7",
      },
    ],
  };
 

  //  CSV
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
      {/* STAT CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3>Total Spent</h3>
          <p className="text-xl font-bold">₹{total}</p>
        </div>

        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3>Transactions</h3>
          <p className="text-xl font-bold">{expenses.length}</p>
        </div>

        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3>Top Category</h3>
          <p className="text-xl font-bold">{topCategory}</p>
        </div>
      </div>

      {/* BUDGET */}
      <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow mb-6">
        <p>₹{remaining} remaining</p>
        <div className="w-full h-3 bg-gray-300 rounded">
          <div
            className="h-3 bg-purple-500"
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* INSIGHT */}
      <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900 mb-6">
        {insight}
      </div>


      {/* FORM */}
      <div className="mb-4">
        <input
          className="p-2 mr-2 bg-gray-100 dark:bg-gray-800"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          className="p-2 mr-2 bg-gray-100 dark:bg-gray-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
        <input
          className="p-2 mr-2 bg-gray-100 dark:bg-gray-800"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
        />
        <button onClick={addExpense} className="bg-purple-500 px-3 py-2">
          Add
        </button>
      </div>

      {/* TABLE */}
      {expenses.map((e) => (
        <div key={e._id}>
          ₹{e.amount} - {e.category}
          <button   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs" onClick={() => deleteExpense(e._id)}>Delete</button>
        </div>
      ))}
    </Layout>
  );
}