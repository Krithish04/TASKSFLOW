import { useEffect, useState } from 'react';
import API from '../../api/axios';

const UserDashboard = () => {
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        // Ensuring we hit the correct endpoint
        const { data } = await API.get('/projects/my-tasks'); 
        setMyTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchMyTasks();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      // Updated endpoint to /projects/ for consistency
      await API.put(`/projects/${id}`, { status });
      setMyTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Fixed the 'tasks' vs 'myTasks' variable naming error here
  const Column = ({ title, status }) => (
    <div className="flex-1 min-w-[300px] p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black uppercase tracking-widest text-sm text-blue-400">{title}</h3>
        <span className="bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-400">
          {myTasks.filter(t => t.status === status).length}
        </span>
      </div>
      
      <div className="space-y-4">
        {myTasks.filter(t => t.status === status).map(task => (
          <div key={task._id} className="p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
            <p className="font-bold text-white mb-1">{task.title}</p>
            <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700">
              <select 
                value={task.status} 
                onChange={(e) => updateStatus(task._id, e.target.value)}
                className="text-[10px] bg-slate-950 text-blue-400 border border-slate-700 p-1 rounded uppercase font-bold outline-none cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Operations <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Real-time task synchronization active.</p>
      </header>
      
  <div className="grid grid-cols-3 gap-4 mb-8">
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-500 uppercase font-bold">Pending</p>
      <h2 className="text-2xl font-black text-white">
        {myTasks.filter(t => t.status === 'Pending').length}
      </h2>
    </div>
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-500 uppercase font-bold">In Progress</p>
      <h2 className="text-2xl font-black text-blue-500">
        {myTasks.filter(t => t.status === 'In Progress').length}
      </h2>
    </div>
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-xs text-slate-500 uppercase font-bold">Completed</p>
      <h2 className="text-2xl font-black text-green-500">
        {myTasks.filter(t => t.status === 'Completed').length}
      </h2>
    </div>
  </div>

      {/* The Kanban Board Layout */}
      <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-10">
        <Column title="Pending Tasks" status="Pending" />
        <Column title="Active Work" status="In Progress" />
        <Column title="Completed" status="Completed" />
      </div>
    </div>
  );
};

export default UserDashboard;