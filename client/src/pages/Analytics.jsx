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

  // 🔹 BAR DATA
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

  // =============================
  // 🔥 NEW SMART ANALYTICS LOGIC
  // =============================

  const now = new Date();

  const currentMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const lastMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);

    return (
      d.getMonth() === lastMonth.getMonth() &&
      d.getFullYear() === lastMonth.getFullYear()
    );
  });

  const currentTotal = currentMonthExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const lastTotal = lastMonthExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // 🔹 TREND
  let trendMessage = "";

  if (lastTotal > 0) {
    const change = ((currentTotal - lastTotal) / lastTotal) * 100;

    if (change > 10) {
      trendMessage = `📈 You spent ${change.toFixed(1)}% more than last month`;
    } else if (change < -10) {
      trendMessage = `📉 You reduced spending by ${Math.abs(change).toFixed(1)}%`;
    } else {
      trendMessage = "➡️ Your spending is stable";
    }
  }

  // 🔹 CATEGORY INSIGHT
  const topCategory =
    Object.keys(categoryData).length > 0
      ? Object.keys(categoryData).reduce((a, b) =>
          categoryData[a] > categoryData[b] ? a : b
        )
      : "None";

  let categoryInsight = "";

  if (topCategory !== "None" && currentTotal > 0) {
    const percent = (categoryData[topCategory] / currentTotal) * 100;
    categoryInsight = `${topCategory} takes ${percent.toFixed(
      0
    )}% of your spending`;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3 className="mb-3 font-semibold">Category Breakdown</h3>
          <Pie data={pieData} />
        </div>

        <div className="p-4 rounded-lg bg-lightCard dark:bg-darkCard shadow">
          <h3 className="mb-3 font-semibold">Spending Overview</h3>
          <Bar data={barData} />
        </div>

      </div>

      {/* TOTAL SUMMARY */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
    <p className="text-xl font-bold">{topCategory}</p>
  </div>
</div>

      {/* 🔥 SMART INSIGHTS */}
     <div className="p-5 rounded-xl bg-purple-100 dark:bg-purple-900 mt-6">
  <h3 className="font-semibold mb-3 text-lg">Smart Insights</h3>

  {/* TREND */}
  {trendMessage && (
    <p className="text-sm mb-1">📊 {trendMessage}</p>
  )}

  {/* CATEGORY */}
  {categoryInsight && (
    <p className="text-sm mb-1">📂 {categoryInsight}</p>
  )}

  {/* ACTIONABLE AI */}
  {categoryInsight.includes("food") && (
    <p className="text-sm text-yellow-300">
      🍔 Try reducing food expenses by cooking more at home
    </p>
  )}

  {categoryInsight.includes("travel") && (
    <p className="text-sm text-yellow-300">
      ✈️ Plan trips in advance to reduce costs
    </p>
  )}

  {trendMessage.includes("more") && (
    <p className="text-sm text-red-300">
      ⚠️ Your spending is increasing — review recent expenses
    </p>
  )}

  <p className="text-xs text-gray-400 mt-3">
    Based on your real spending behavior
  </p>
</div>
    </Layout>
  );
}