import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send data to your Express Backend
      await API.post('/auth/register', formData);
      // 2. Automatically log them in after registration
      await login(formData.email, formData.password);
      navigate('/'); 
    } catch (err) {
      alert('Registration Failed: Email might already be in use.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
      <h1 className="text-5xl font-black text-blue-500 mb-8">Join TaskFlow</h1>
      
      <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 w-96 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <select 
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg outline-none"
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="user">Standard User</option>
            <option value="manager">Project Manager</option>
            <option value="admin">System Admin</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-bold transition">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-400">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;