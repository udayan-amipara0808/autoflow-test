import React, { useState } from 'react';
import { Eye, X, Copy, RefreshCw, Layers } from 'lucide-react';
import { mockTasks } from '../../utils/mockData';
import { formatHash, formatTime } from '../../utils/formatters';

const TaskMonitor = ({ onTaskClick }) => {
  const [filter, setFilter] = useState('All');

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
    ? mockTasks
    : mockTasks.filter(t => t.status === filter);

  const getFilterButtonClass = (f) => {
    const base = "px-4 py-1.5 rounded-md text-sm font-medium transition-all ";
    const active = "bg-dark-700 text-white shadow";
    const inactive = "text-gray-400 hover:text-white";
    const current = filter === (f === 'Active' ? 'Executing' : f);
    return base + (current ? active : inactive);
  };

  const getProgressClass = (status) => {
    return "h-full rounded-full transition-all duration-1000 " + (status === 'Failed' ? 'bg-red-500' : 'bg-primary-500');
  };

  return (
    <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg flex flex-col h-full">
      <div className="p-6 border-b border-dark-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="text-primary-500" />
            Task Monitor
          </h2>
          <p className="text-sm text-gray-500">Real-time supervision of agentic workflows</p>
        </div>

        <div className="flex gap-2 bg-dark-800 p-1 rounded-lg">
          {['All', 'Active', 'Completed', 'Failed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === 'Active' ? 'Executing' : f)}
              className={getFilterButtonClass(f)}
            >
              {f}
            </button>
          ))}
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
              <th className="p-4 font-medium">Node</th>
              <th className="p-4 font-medium">Escrow</th>
              <th className="p-4 font-medium">Time</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {filteredTasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="hover:bg-dark-800/50 transition-colors cursor-pointer group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-primary-400">#{task.id}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-700 rounded text-gray-500 transition-opacity">
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
                <td className="p-4 w-48">
                  <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className={getProgressClass(task.status)}
                      style={{ width: task.progress + '%' }}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-gray-400">
                    {task.nodeId || <span className="text-gray-600 italic">Finding node...</span>}
                  </span>
                </td>
                <td className="p-4 font-mono text-white">
                  {task.escrowAmount} MON
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {formatTime(task.startedAt)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    {task.status === 'Executing' || task.status === 'Pending' ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); /* cancel logic */ }}
                        className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}

            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="8" className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center">
                      <Layers size={32} className="opacity-20" />
                    </div>
                    <p>No tasks found</p>
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
