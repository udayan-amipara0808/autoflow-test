import React, { useState } from 'react';
import { Activity, Server, Settings, Database, Terminal, Play, Square, Save, RotateCcw, AlertCircle } from 'lucide-react';

const OrchestratorDebug = () => {
  const [status, setStatus] = useState('Running');
  const [activeTab, setActiveTab] = useState('engine');

  const logs = [
    { time: '10:42:15', level: 'INFO', msg: 'Orchestrator loop started' },
    { time: '10:42:18', level: 'INFO', msg: 'Node discovery: Found 127 nodes' },
    { time: '10:42:22', level: 'WARN', msg: 'Node-7f3a high latency (450ms)' },
    { time: '10:42:25', level: 'INFO', msg: 'Routing algorithm updated weights' },
    { time: '10:42:30', level: 'INFO', msg: 'Task #9b2c routed to Node-5c8d' },
  ];

  const decisions = [
    { id: 'Dec-123', task: 'Task #7f3a', nodes: 12, winner: 'Node-9b2c', score: 94.5, time: '230ms' },
    { id: 'Dec-124', task: 'Task #4e5f', nodes: 8, winner: 'Node-1a2b', score: 88.2, time: '180ms' },
    { id: 'Dec-125', task: 'Task #9c8d', nodes: 15, winner: 'Node-3d4e', score: 91.0, time: '210ms' },
  ];

  const getStatusClass = () => {
    return "flex items-center gap-2 px-4 py-2 rounded-lg border " +
      (status === 'Running' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400');
  };

  const getTabClass = (tab) => {
    const base = "w-full text-left p-4 hover:bg-dark-800 transition-colors border-l-2 ";
    return base + (activeTab === tab ? 'border-primary-500 bg-dark-800' : 'border-transparent');
  };

  const getLogClass = (level) => {
    const base = "mr-3 font-bold ";
    if (level === 'INFO') return base + 'text-blue-400';
    if (level === 'WARN') return base + 'text-yellow-400';
    return base + 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Engine Status Header */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-primary-500" />
            Orchestrator Engine Status
          </h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span>Uptime: <span className="text-white font-mono">7d 14h 23m</span></span>
            <span>Processed: <span className="text-white font-mono">45,678</span></span>
            <span>Error Rate: <span className="text-green-500 font-mono">0.2%</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={getStatusClass()}>
            <div className={"w-2 h-2 rounded-full " + (status === 'Running' ? 'bg-green-500 animate-pulse' : 'bg-red-500')} />
            {status}
          </div>
          <button
            onClick={() => setStatus(status === 'Running' ? 'Stopped' : 'Running')}
            className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-white transition-colors border border-dark-700"
          >
            {status === 'Running' ? <Square size={20} fill="currentColor" className="text-red-400" /> : <Play size={20} fill="currentColor" className="text-green-400" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 bg-dark-900 border border-dark-700 rounded-xl overflow-hidden h-fit">
          <button onClick={() => setActiveTab('engine')} className={getTabClass('engine')}>
            <div className="font-bold text-white flex items-center gap-2"><Server size={18} /> Engine Logic</div>
            <div className="text-xs text-gray-500 mt-1">Routing & Decision Logs</div>
          </button>
          <button onClick={() => setActiveTab('config')} className={getTabClass('config')}>
            <div className="font-bold text-white flex items-center gap-2"><Settings size={18} /> Configuration</div>
            <div className="text-xs text-gray-500 mt-1">Weights & Thresholds</div>
          </button>
          <button onClick={() => setActiveTab('database')} className={getTabClass('database')}>
            <div className="font-bold text-white flex items-center gap-2"><Database size={18} /> Database</div>
            <div className="text-xs text-gray-500 mt-1">Queries & Cache</div>
          </button>
          <button onClick={() => setActiveTab('logs')} className={getTabClass('logs')}>
            <div className="font-bold text-white flex items-center gap-2"><Terminal size={18} /> System Logs</div>
            <div className="text-xs text-gray-500 mt-1">Console Output</div>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-dark-900 border border-dark-700 rounded-xl p-6 shadow-lg min-h-[500px]">
          {activeTab === 'engine' && (
            <div>
              <h3 className="font-bold text-white mb-4">Recent Routing Decisions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-dark-800 text-gray-500 text-sm">
                      <th className="p-3">Decision ID</th>
                      <th className="p-3">Task</th>
                      <th className="p-3">Nodes Eval</th>
                      <th className="p-3">Winner</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                    {decisions.map((d) => (
                      <tr key={d.id} className="hover:bg-dark-800/50">
                        <td className="p-3 font-mono text-xs text-gray-400">{d.id}</td>
                        <td className="p-3 text-primary-400 text-sm">{d.task}</td>
                        <td className="p-3 text-gray-300 text-sm">{d.nodes}</td>
                        <td className="p-3 text-green-400 text-sm font-mono">{d.winner}</td>
                        <td className="p-3 text-white font-bold text-sm">{d.score}</td>
                        <td className="p-3 text-gray-500 text-sm">{d.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-white mb-4">Routing Weights</h3>
                <div className="space-y-4 max-w-lg">
                  {['Latency', 'Cost', 'Load', 'Reputation'].map(metric => (
                    <div key={metric}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{metric} Weight</span>
                        <span className="text-primary-400">25%</span>
                      </div>
                      <input type="range" className="w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center gap-2">
                  <Save size={16} /> Save Config
                </button>
                <button className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-lg flex items-center gap-2 border border-dark-700">
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-black/80 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">
                  <span className="text-gray-500 mr-3">[{log.time}]</span>
                  <span className={getLogClass(log.level)}>
                    {log.level}
                  </span>
                  <span className="text-gray-300">{log.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrchestratorDebug;
