import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* TOP BAR */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <button
            onClick={() => setDark(!dark)}
            className="px-4 py-2 rounded bg-primary text-white"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}