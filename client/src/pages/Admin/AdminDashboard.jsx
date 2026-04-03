import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // NEW: State for global task list
  const [stats, setStats] = useState({ userCount: 0, managerCount: 0, projectCount: 0 });

  const fetchData = async () => {
    try {
      const usersRes = await API.get('/auth/users');
      const statsRes = await API.get('/admin/stats');
      const tasksRes = await API.get('/admin/all-tasks'); // NEW: Fetching global audit data
      
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setAllTasks(tasksRes.data);
    } catch (err) {
      console.error("Error loading administration data:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRoleChange = async (id, newRole) => {
    await API.patch(`/admin/user-role/${id}`, { role: newRole });
    fetchData(); 
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Purge user? This cannot be undone.")) {
      await API.delete(`/admin/user/${id}`);
      fetchData();
    }
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white">
      {/* 1. STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Standard Users" value={stats.userCount} color="blue" />
        <StatCard title="Project Managers" value={stats.managerCount} color="purple" />
        <StatCard title="Total Assignments" value={stats.projectCount} color="green" />
      </div>

      {/* 2. USER DIRECTORY SECTION */}
      <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-slate-500 border-l-4 border-blue-600 pl-4">
        User Management
      </h2>
      
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl mb-16">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-[10px] text-slate-500 uppercase tracking-widest">
            <tr>
              <th className="p-5">Name / Email</th>
              <th className="p-5">Current Role</th>
              <th className="p-5 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-slate-800/20 transition">
                <td className="p-5">
                  <p className="font-bold">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </td>
                <td className="p-5">
                  <select 
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="bg-slate-950 text-xs border border-slate-700 p-2 rounded uppercase font-bold text-blue-400 outline-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => handleDeleteUser(u._id)}
                    className="text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg border border-red-500/20 transition text-[10px] font-black uppercase"
                  >
                    Purge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. GLOBAL TASK AUDIT SECTION */}
      <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-slate-500 border-l-4 border-purple-600 pl-4">
        Global Task Audit
      </h2>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-[10px] text-slate-500 uppercase tracking-widest">
            <tr>
              <th className="p-5">Source (Manager)</th>
              <th className="p-5">Project Details</th>
              <th className="p-5">Target (Employee)</th>
              <th className="p-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {allTasks.map(task => (
              <tr key={task._id} className="hover:bg-slate-800/10 transition">
                <td className="p-5">
                  <p className="font-bold text-blue-400">{task.createdBy?.name || "System"}</p>
                  <p className="text-[10px] text-slate-500 italic">Originator</p>
                </td>
                <td className="p-5">
                  <p className="font-bold text-slate-200">{task.title}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{task.description}</p>
                </td>
                <td className="p-5">
                  <p className="font-bold text-purple-400">{task.assignedTo?.name || "Unassigned"}</p>
                  <p className="text-[10px] text-slate-500 italic">Assignee</p>
                </td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                    task.status === 'Completed' ? 'border-green-500/30 bg-green-500/10 text-green-500' :
                    task.status === 'In Progress' ? 'border-blue-500/30 bg-blue-500/10 text-blue-500' : 
                    'border-slate-700 bg-slate-800 text-slate-500'
                  }`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allTasks.length === 0 && (
          <p className="p-10 text-center text-slate-600 text-sm italic">No active projects found in the database.</p>
        )}
      </div>
    </div>
  );
};

// Internal Stat Card Component
const StatCard = ({ title, value, color }) => (
  <div className={`p-6 bg-slate-900 border-b-4 border-${color}-500 rounded-2xl shadow-lg`}>
    <p className="text-xs text-slate-500 uppercase font-black mb-1 tracking-tighter">{title}</p>
    <h3 className="text-4xl font-black">{value}</h3>
  </div>
);

export default AdminDashboard;