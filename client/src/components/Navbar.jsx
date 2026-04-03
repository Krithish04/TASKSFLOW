import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex justify-between items-center text-white">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-black text-blue-500 italic">TaskFlow</Link>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 uppercase tracking-widest text-slate-400">
          {user?.role} Mode
        </span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-sm text-slate-300">Welcome, <strong>{user?.name}</strong></span>
        <button 
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-1.5 rounded-lg border border-red-500/50 transition-all text-sm font-bold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;