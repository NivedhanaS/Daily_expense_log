import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Analytics", path: "/analytics" },
    { name: "Expenses", path: "/expenses" },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block w-60 bg-gray-100 dark:bg-gray-900 p-4">
        <h1 className="text-xl font-bold mb-6 text-primary">
          spend<span className="text-gray-500">.</span>wise
        </h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Drawer (LEFT) */}
          <div className="absolute left-0 top-0 h-full w-60 bg-gray-100 dark:bg-gray-900 p-4 shadow-lg">

            <h1 className="text-xl font-bold mb-6 text-primary">
              spend<span className="text-gray-500">.</span>wise
            </h1>

            <nav className="flex flex-col gap-2">
              {menu.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`px-3 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

          </div>
        </div>
      )}
    </>
  );
}