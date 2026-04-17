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
    const res = await axios.get("https://daily-expense-log.onrender.com/api/expenses", {
      headers: { Authorization: token },
    });
    setExpenses(res.data);
  };

  const deleteExpense = async (id) => {
    await axios.delete(`https://daily-expense-log.onrender.com/api/expenses/${id}`, {
      headers: { Authorization: token },
    });
    fetchExpenses();
  };

  const filtered = expenses.filter((e) => {
    return (
      e.note.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || e.category === category)
    );
  });

  const categories = [...new Set(expenses.map((e) => e.category))];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">Expenses</h1>

        {/* SEARCH */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-full md:w-64"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-lightCard dark:bg-darkCard rounded-xl shadow overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Note</th>
                <th className="p-3"></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3 font-semibold">₹{e.amount}</td>

                  <td className="p-3 capitalize">
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-600 text-xs">
                      {e.category}
                    </span>
                  </td>

                  <td className="p-3 text-gray-500">{e.note}</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => deleteExpense(e._id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </Layout>
  );
}