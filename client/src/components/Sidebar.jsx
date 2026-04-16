import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `block px-3 py-2 rounded ${
      location.pathname === path
        ? "bg-primary text-black dark:text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
      }`;

  return (
    <div
      className="
      w-60 min-h-screen p-4
      bg-gray-100 text-black
      dark:bg-gray-900 dark:text-white
      transition-colors duration-300
    "
    >
      <h1 className="text-xl font-bold mb-6 text-primary">
        spend<span className="text-gray-500">.</span>wise
      </h1>

      <nav className="flex flex-col gap-2">
        <Link to="/dashboard" className={linkStyle("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/analytics" className={linkStyle("/analytics")}>
          Analytics
        </Link>

        <Link to="/expenses" className={linkStyle("/expenses")}>
          Expenses
        </Link>
      </nav>
    </div>
  );
}