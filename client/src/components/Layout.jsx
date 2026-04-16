import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children,onExport }) {
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
       <div className="flex justify-between items-center mb-6">
<div></div>
  <div className="flex gap-2">

    {onExport && (
      <button
        onClick={onExport}
        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
      >
        Export CSV
      </button>
    )}

    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 rounded bg-primary text-white"
    >
      {dark ? "☀️" : "🌙"}
    </button>

  </div>
</div>

        {children}
      </div>
    </div>
  );
}