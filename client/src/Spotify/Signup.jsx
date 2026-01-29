import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", formData);
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#191414] text-white">
      <div className="w-96 p-8 bg-[#121212] rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-pink-300">Sign Up</h2>
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
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-pink-300 font-bold">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
