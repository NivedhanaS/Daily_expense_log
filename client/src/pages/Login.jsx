import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await axios.post(
      "https://daily-expense-log.onrender.com/api/auth/login",
      { email, 
        password,
       },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data);
    
    localStorage.setItem("token", res.data.token);//stores Jwt token in db
    navigate("/dashboard"); 
  } catch (err) {
    alert(err.response?.data || "Login failed");
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

    <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Login
      </h2>

      <input
        className="w-full mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white outline-none"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-purple-500 hover:bg-purple-600 py-3 rounded-lg text-white font-semibold"
        onClick={handleLogin}
      >
        Login
      </button>

      <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-300">
        Don't have an account?{" "}
        <span
          className="text-purple-500 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Sign up
        </span>
      </p>

    </div>
  </div>
);
}