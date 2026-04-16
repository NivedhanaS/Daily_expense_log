import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Signup successful");
      navigate("/"); // go to login
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 rounded-xl bg-lightCard dark:bg-darkCard shadow w-80">

        <h2 className="text-xl font-bold mb-4">Create Account</h2>

        <input
          placeholder="Name"
          className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-800"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-800"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-gray-100 dark:bg-gray-800"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white p-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}