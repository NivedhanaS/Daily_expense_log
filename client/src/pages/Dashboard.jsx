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
  const token = localStorage.getItem("token");

//  PIE CHART DATA
const categoryData = {};
expenses.forEach((e) => {
  categoryData[e.category] =
    (categoryData[e.category] || 0) + Number(e.amount);
});

const pieData = {
  labels: Object.keys(categoryData),
  datasets: [
    {
      data: Object.values(categoryData),
      backgroundColor: ["#7c6af7", "#22d3ee", "#f87171", "#34d399"],
    },
  ],
};

//  BAR CHART DATA
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

  //to calc real stats STAT CARDS
const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

const categories = {};
expenses.forEach((e) => {
  categories[e.category] = (categories[e.category] || 0) + e.amount;
});

const topCategory = Object.keys(categories).reduce(
  (a, b) => (categories[a] > categories[b] ? a : b),
  "None"
);
  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses", {
      headers: { Authorization: token },
    });
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async () => {
    await axios.post(
      "http://localhost:5000/api/expenses",
      {
        amount,
        category,
        note,
        date: new Date(),
      },
      { headers: { Authorization: token } }
    );

    setAmount("");
    setCategory("");
    setNote("");

    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
      headers: { Authorization: token },
    });

    fetchExpenses();
  };

  return (
    <Layout>
      {/* 🔹 STAT CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3 className="text-sm text-gray-400">Total Spent</h3>
          <p className="text-xl font-bold">₹{total}</p>
        </div>

        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3 className="text-sm text-gray-400">Transactions</h3>
          <p className="text-xl font-bold">{expenses.length}</p>
        </div>

        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3 className="text-sm text-gray-400">Top Category</h3>
          <p className="text-xl font-bold">{topCategory}</p>
        </div>

      </div>

{/*  CHARTS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
  <h3 className="mb-2 font-semibold">Category Breakdown</h3>

  <div className="h-64 flex items-center justify-center ">
    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
  </div>
</div>
<div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
  <h3 className="mb-2 font-semibold">Expenses Overview</h3>

  <div className="h-64 flex items-center justify-center">
    <Bar data={barData} options={{ maintainAspectRatio: false }} />
  </div>
</div>
</div>


      {/* ADD EXPENSE */}
      <div className="mb-4">
        <input
          className="  p-4 rounded-lg
  bg-lightCard dark:bg-darkCard
  shadow"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="  p-4 rounded-lg
  bg-lightCard dark:bg-darkCard
  shadow"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="  p-4 rounded-lg
  bg-lightCard dark:bg-darkCard
  shadow"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow mb-6"
          onClick={addExpense}
        >
          Add
        </button>
      </div>

      {/* EXPENSE TABLE */}
     <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
  <h2 className="mb-3 font-semibold">Recent Expenses</h2>

  <table className="w-full text-sm">
    <thead>
      <tr className="text-left text-gray-400">
        <th>Amount</th>
        <th>Category</th>
        <th>Note</th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      {expenses.map((e) => (
        <tr key={e._id} className="border-t border-gray-700">
          <td>₹{e.amount}</td>
          <td>{e.category}</td>
          <td>{e.note}</td>
          <td>
            <button
              className="text-red-400"
              onClick={() => deleteExpense(e._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </Layout>
  );
}