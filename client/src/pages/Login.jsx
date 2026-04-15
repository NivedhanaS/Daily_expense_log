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
      "http://localhost:5000/api/auth/login",
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
    <div style={{ padding: 230 }}>
      <h2>Login</h2>

      <input className="p-2 mr-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input type="password" className="p-2 mr-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />
      <br /><br />

      <button  className="bg-purple-500 px-4 py-2 rounded text-white" onClick={handleLogin}>Login</button>
    </div>
  );
}