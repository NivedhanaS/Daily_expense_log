import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

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

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
      headers: { Authorization: token },
    });
    fetchExpenses();
  };

  // 🔹 FILTER LOGIC
  const filtered = expenses.filter((e) => {
    return (
      e.note.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || e.category === category)
    );
  });

  // 🔹 UNIQUE CATEGORIES
  const categories = [...new Set(expenses.map((e) => e.category))];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Expenses</h1>

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex gap-3 mb-6">
        <input
          placeholder="Search note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 📊 TABLE */}
      <div className="w-full text-sm bg-lightCard dark:bg-darkCard shadow">
        <table className="text-gray-400">
          <thead>
            <tr className="text-left p-2">
              <th>Amount</th>
              <th>Category</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((e) => (
              <tr key={e._id} className="border-t border-gray-700 ">
                <td className="p-2">₹{e.amount}</td>
                <td className="p-2 capitalize">{e.category}</td>
                <td className="p-2">{e.note}</td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => deleteExpense(e._id)}
                    className="text-red-400 hover:text-red-600"
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