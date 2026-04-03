import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      
      // Navigate based on the fresh data
      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'manager') navigate('/manager');
      else navigate('/user'); 

    } catch (err) {
      const msg = err.response?.data?.message || "Invalid Credentials";
      alert(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-950">
      {/* BIG TEST HEADER */}
      <h1 className="text-6xl font-black text-red-500 mb-10 block">TaskFlow</h1>

      <div className="p-8 bg-slate-800 rounded-2xl border border-slate-700 w-96">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 p-2 rounded font-bold">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline font-medium"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
