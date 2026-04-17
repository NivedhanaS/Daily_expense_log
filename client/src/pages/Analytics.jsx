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
    const res = await axios.get("https://daily-expense-log.onrender.com/api/expenses", {
      headers: { Authorization: token },
    });
    setExpenses(res.data);
  };

  // CATEGORY DATA
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

  // MONTH CALC
  const now = new Date();

  const currentTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const lastTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return (
        d.getMonth() === lastMonth.getMonth() &&
        d.getFullYear() === lastMonth.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const topCategory =
    Object.keys(categoryData).length > 0
      ? Object.keys(categoryData).reduce((a, b) =>
          categoryData[a] > categoryData[b] ? a : b
        )
      : "None";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">Analytics</h1>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="p-4 rounded-xl bg-lightCard dark:bg-darkCard shadow">
            <h3 className="mb-3 font-semibold">Category Breakdown</h3>
            <div className="h-[300px]">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-lightCard dark:bg-darkCard shadow">
            <h3 className="mb-3 font-semibold">Spending Overview</h3>
            <div className="h-[300px]">
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

        </div>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-lightCard dark:bg-darkCard rounded-xl">
            <p className="text-sm text-gray-400">This Month</p>
            <p className="text-xl font-bold">₹{currentTotal}</p>
          </div>

          <div className="p-4 bg-lightCard dark:bg-darkCard rounded-xl">
            <p className="text-sm text-gray-400">Last Month</p>
            <p className="text-xl font-bold">₹{lastTotal}</p>
          </div>

          <div className="p-4 bg-lightCard dark:bg-darkCard rounded-xl">
            <p className="text-sm text-gray-400">Top Category</p>
            <p className="text-xl font-bold capitalize">{topCategory}</p>
          </div>
        </div>

        {/* INSIGHT */}
        <div className="p-5 rounded-xl bg-purple-600 text-white mt-6">
          <h3 className="font-semibold mb-2">Smart Insights</h3>
          <p className="text-sm">
            {topCategory} dominates your spending. Try optimizing it.
          </p>
        </div>

      </div>
    </Layout>
  );
}