export default function Sidebar() {
  return (
    <div className="
      w-60 min-h-screen p-4
      bg-gray-100 text-black
      dark:bg-gray-900 dark:text-white
      transition-colors duration-300
    ">
      <h1 className="text-xl font-bold mb-6 text-primary">
        spend<span className="text-gray-500">.</span>wise
      </h1>

      <nav className="flex flex-col gap-3">
        <a className="hover:text-primary">Dashboard</a>
        <a className="hover:text-primary">Analytics</a>
        <a className="hover:text-primary">Expenses</a>
      </nav>
    </div>
  );
}