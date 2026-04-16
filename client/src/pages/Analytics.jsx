import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

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

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses", {
      headers: { Authorization: token },
    });
    setExpenses(res.data);
  };

  // 🔹 CATEGORY DATA
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

  // 🔹 SIMPLE BAR (amounts)
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

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-2 gap-6">

        {/* PIE */}
        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3 className="mb-3 font-semibold">Category Breakdown</h3>
          <Pie data={pieData} />
        </div>

        {/* BAR */}
        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3 className="mb-3 font-semibold">Spending Overview</h3>
          <Bar data={barData} />
        </div>

      </div>
    </Layout>
  );
}