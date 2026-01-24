import React, { useState, useEffect } from 'react';
import { Eye, X, Copy, Layers, ExternalLink, RefreshCw } from 'lucide-react';
import { getStoredTasks, initializeExampleTasks, updateTaskStatus } from '../../utils/taskStorage';

const TaskMonitor = ({ onTaskClick }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  // Load tasks on mount and periodically refresh
  useEffect(() => {
    initializeExampleTasks(); // Add example data if empty
    loadTasks();

    // Refresh every 5 seconds
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTasks = () => {
    setTasks(getStoredTasks());
  };

  const getValueColor = (status) => {
    const base = "px-2.5 py-1 rounded-full text-xs font-medium ";
    if (status === 'Pending') return base + 'bg-yellow-500/10 text-yellow-500';
    if (status === 'Routing') return base + 'bg-blue-500/10 text-blue-500';
    if (status === 'Executing') return base + 'bg-purple-500/10 text-purple-500';
    if (status === 'Completed') return base + 'bg-green-500/10 text-green-500';
    if (status === 'Failed') return base + 'bg-red-500/10 text-red-500';
    return base + 'bg-gray-500/10 text-gray-500';
  };

  const filteredTasks = filter === 'All'
    ? tasks
    : filter === 'Active'
      ? tasks.filter(t => t.status === 'Pending' || t.status === 'Executing' || t.status === 'Routing')
      : tasks.filter(t => t.status === filter);

  const getFilterButtonClass = (f) => {
    const base = "px-4 py-1.5 rounded-md text-sm font-medium transition-all ";
    const active = "bg-dark-700 text-white shadow";
    const inactive = "text-gray-400 hover:text-white";
    return base + (filter === f ? active : inactive);
  };

  const getProgressClass = (status) => {
    return "h-full rounded-full transition-all duration-1000 " + (status === 'Failed' ? 'bg-red-500' : 'bg-primary-500');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    return diffDays + 'd ago';
  };

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg flex flex-col h-full">
      <div className="p-6 border-b border-dark-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="text-primary-500" />
            Task Monitor
          </h2>
          <p className="text-sm text-gray-500">Your submitted tasks ({tasks.length} total)</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadTasks}
            className="p-2 hover:bg-dark-700 text-gray-400 hover:text-white rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <div className="flex gap-2 bg-dark-800 p-1 rounded-lg">
            {['All', 'Active', 'Completed', 'Failed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={getFilterButtonClass(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-dark-800 text-gray-400 text-sm">
              <th className="p-4 font-medium">Task ID</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Progress</th>
              <th className="p-4 font-medium">Escrow</th>
              <th className="p-4 font-medium">Time</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {filteredTasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onTaskClick && onTaskClick(task)}
                className="hover:bg-dark-800/50 transition-colors cursor-pointer group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-primary-400">#{task.id.substring(0, 8)}</span>
                    <button
                      onClick={(e) => copyToClipboard(task.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-700 rounded text-gray-500 transition-opacity"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-300">{task.type}</span>
                </td>
                <td className="p-4">
                  <span className={getValueColor(task.status)}>
                    {task.status}
                  </span>
                </td>
                <td className="p-4 w-32">
                  <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className={getProgressClass(task.status)}
                      style={{ width: task.progress + '%' }}
                    />
                  </div>
                </td>
                <td className="p-4 font-mono text-white text-sm">
                  {task.escrowAmount} MON
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {formatTime(task.createdAt)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {task.txHash && (
                      <a
                        href={"https://testnet.monadexplorer.com/tx/" + task.txHash}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 rounded-lg transition-colors"
                        title="View on Explorer"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); onTaskClick && onTaskClick(task); }}
                      className="p-1.5 hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    {(task.status === 'Executing' || task.status === 'Pending') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTaskStatus(task.id, { status: 'Failed', progress: 0 });
                          loadTasks();
                        }}
                        className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="7" className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center">
                      <Layers size={32} className="opacity-20" />
                    </div>
                    <p>No tasks found</p>
                    <p className="text-sm text-gray-600">Submit a new task to get started</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskMonitor;
