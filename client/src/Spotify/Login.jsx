import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#191414] text-white">
      <div className="w-96 p-8 bg-[#121212] rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-pink-300">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 mb-3 bg-[#222222] text-white rounded-md"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 mb-3 bg-[#222222] text-white rounded-md"
            onChange={handleChange}
            required
          />
          <button className="w-full bg-pink-300 text-black p-3 rounded-md font-bold mt-4">
            Log In
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-pink-300 font-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
