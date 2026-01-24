import React from 'react';
import { Server, Activity, Cpu, Wifi, Star, Zap } from 'lucide-react';

const NodeCard = ({ node, onSelect }) => {
  const isOnline = node.status === 'Online' || node.status === 'Busy';

  const getStatusColor = () => {
    if (node.status === 'Online') return 'bg-green-500 animate-pulse';
    if (node.status === 'Busy') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = () => {
    const base = "text-xs font-medium px-2 py-0.5 rounded border ";
    if (node.status === 'Online') return base + "bg-green-500/10 border-green-500/20 text-green-400";
    if (node.status === 'Busy') return base + "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    return base + "bg-red-500/10 border-red-500/20 text-red-400";
  };

  const loadColor = () => {
    if (node.load > 80) return 'bg-red-500';
    if (node.load > 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div
      onClick={() => onSelect && onSelect(node)}
      className={"bg-dark-900 border border-dark-700 rounded-xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-500/30 group relative overflow-hidden " + (onSelect ? 'cursor-pointer' : '')}
    >
      {/* Status Bar */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-lg">{node.id}</span>
            <span className={"w-2 h-2 rounded-full " + getStatusColor()} />
          </div>
          <span className={getStatusBadge()}>
            {node.status}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="font-bold text-sm">{node.reputation}</span>
          </div>
          <span className="text-xs text-gray-500">{node.tasksCompleted} tasks</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-dark-800/50 p-2 rounded-lg">
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
            <Cpu size={12} />
            <span>CPU</span>
          </div>
          <div className="text-sm font-medium text-white">{node.specs.cpu} Cores</div>
        </div>
        <div className="bg-dark-800/50 p-2 rounded-lg">
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
            <Zap size={12} />
            <span>RAM</span>
          </div>
          <div className="text-sm font-medium text-white">{node.specs.ram} GB</div>
        </div>
        <div className="bg-dark-800/50 p-2 rounded-lg">
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
            <Activity size={12} />
            <span>Health</span>
          </div>
          <div className={"text-sm font-medium " + (node.health > 80 ? 'text-green-400' : 'text-yellow-400')}>
            {node.health}%
          </div>
        </div>
        <div className="bg-dark-800/50 p-2 rounded-lg">
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
            <Wifi size={12} />
            <span>Ping</span>
          </div>
          <div className="text-sm font-medium text-white">{node.latency}ms</div>
        </div>
      </div>

      {/* GPU Badge */}
      {node.specs.gpu && (
        <div className="absolute top-0 right-0 p-px rounded-bl-xl bg-gradient-to-br from-purple-500 to-blue-500">
          <div className="bg-dark-900 rounded-bl-[11px] px-2 py-1">
            <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              GPU ENABLED
            </span>
          </div>
        </div>
      )}

      {/* Load Bar */}
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Current Load</span>
          <span className="text-gray-300">{node.load}%</span>
        </div>
        <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={"h-full rounded-full transition-all duration-1000 " + loadColor()}
            style={{ width: (node.load) + '%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default NodeCard;
