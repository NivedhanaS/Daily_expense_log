import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children, onExport }) {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex h-screen">

      {/* SIDEBAR (desktop) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-between items-center p-4 border-b">

          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
          >
            ☰
          </button>

          <div className="flex gap-2 ml-auto">
            {onExport && (
              <button
                onClick={onExport}
                className="bg-green-500 px-4 py-2 rounded text-white"
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
        {/* ADD LOGOUT HERE */}
        <div className="flex justify-between items-center p-4"><button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white text-sm"
      >
        Logout
      </button>
    </div>
  </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}