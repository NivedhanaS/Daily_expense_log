import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Expenses from "./pages/Expenses";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/expenses" element={<Expenses />} />
    </Routes>
  );
}

export default App;