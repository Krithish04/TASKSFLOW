import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [managedTasks, setManagedTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: ''
  });

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get('/auth/employees');
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchManagedTasks = async () => {
    try {
      const { data } = await API.get('/projects/manager-tasks');
      setManagedTasks(data);
    } catch (err) {
      console.error("Error fetching task list:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchManagedTasks();
  }, []);

  const handlePostProject = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects/create', formData);
      alert("Project Assigned Successfully!");
      setFormData({ title: '', description: '', assignedTo: '', deadline: '' });
      fetchManagedTasks();
    } catch (err) {
      alert("Error assigning project");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to remove this task?")) {
      try {
        await API.delete(`/projects/${taskId}`);
        fetchManagedTasks();
      } catch (err) {
        alert("Failed to delete task");
      }
    }
  };

  // Helper to format dates cleanly
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white">
      {/* SECTION: ASSIGNMENT FORM */}
      <h2 className="text-3xl font-black mb-6 text-blue-500 uppercase tracking-tighter italic">
        Assign <span className="text-white">New Task</span>
      </h2>
      
      <form onSubmit={handlePostProject} className="max-w-4xl bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
        <input 
          type="text" placeholder="Project Title" required
          className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 outline-none focus:border-blue-500 transition"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        
        <textarea 
          placeholder="Task Description..." required
          className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 h-24 outline-none focus:border-blue-500 transition"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            required
            className="p-3 bg-slate-800 rounded-lg border border-slate-700 outline-none text-white appearance-none cursor-pointer"
            value={formData.assignedTo}
            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
          >
            <option value="">Assign to Employee...</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>

          <input 
            type="date" required
            className="p-3 bg-slate-800 rounded-lg border border-slate-700 outline-none text-white cursor-pointer"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
          />
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-xl font-black uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-blue-900/20">
          Deploy Assignment
        </button>
      </form>

      {/* SECTION: TASK MANAGEMENT TABLE */}
      <h2 className="text-2xl font-bold mt-16 mb-6 text-slate-400">Active Task Tracking</h2>
      
      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-[0.2em]">
              <th className="p-5 border-b border-slate-800">Project Title</th>
              <th className="p-5 border-b border-slate-800">Assigned Employee</th>
              <th className="p-5 border-b border-slate-800 text-center">Status</th>
              <th className="p-5 border-b border-slate-800 text-center">Deadline</th>
              <th className="p-5 border-b border-slate-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {managedTasks.map((task) => {
              // Check if task is overdue
              const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'Completed';
              
              return (
                <tr key={task._id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-slate-200">{task.title}</p>
                    <p className="text-[10px] text-slate-500">Created: {formatDate(task.createdAt)}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black uppercase">
                        {task.assignedTo?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{task.assignedTo?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-slate-500">{task.assignedTo?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      task.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <p className={`text-sm font-mono ${isOverdue ? 'text-orange-500 font-bold' : 'text-slate-300'}`}>
                      {formatDate(task.deadline)}
                    </p>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg border border-red-500/20 transition-all text-[10px] font-black uppercase"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {managedTasks.length === 0 && (
          <div className="p-20 text-center text-slate-600">
            <p className="text-sm italic">No active projects detected in system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;