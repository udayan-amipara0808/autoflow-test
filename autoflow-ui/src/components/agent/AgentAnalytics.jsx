import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AgentAnalytics = () => {
  // Mock Chart Data
  const tasksOverTime = Array.from({ length: 14 }, (_, i) => ({
    name: "Day " + (i + 1),
    tasks: Math.floor(Math.random() * 50) + 10,
    cost: Math.floor(Math.random() * 1000) + 200
  }));

  const taskDistribution = [
    { name: 'Completed', value: 85, color: '#22c55e' },
    { name: 'Failed', value: 5, color: '#ef4444' },
    { name: 'Cancelled', value: 10, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Trend Chart */}
        <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-white mb-6 flex items-center justify-between">
            <span>Task Volume & Costs</span>
            <select className="bg-dark-800 border-none text-xs rounded text-gray-400">
              <option>Last 14 Days</option>
              <option>Last 30 Days</option>
            </select>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tasksOverTime}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis yAxisId="left" stroke="#4b5563" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#4b5563" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="tasks" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTasks)" />
                <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#8b5cf6" dot={false} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary-500 rounded"></span>
              <span className="text-gray-400">Task Count</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded"></span>
              <span className="text-gray-400">Cost (MON)</span>
            </div>
          </div>
        </div>

        {/* Distribution Pie */}
        <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-white mb-6">Success Rate Distribution</h3>
          <div className="flex items-center">
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={"cell-" + index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 pr-8">
              {taskDistribution.map(item => (
                <div key={item.name}>
                  <div className="text-xs text-gray-500 mb-1">{item.name}</div>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp size={16} />
            <span className="text-sm">Avg Cost per Task</span>
          </div>
          <div className="text-2xl font-bold text-white">45.2 MON</div>
          <div className="text-green-500 text-xs mt-1">↓ 12% vs last month</div>
        </div>
        <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <BarChart3 size={16} />
            <span className="text-sm">Compute Usage</span>
          </div>
          <div className="text-2xl font-bold text-white">1,240 hrs</div>
          <div className="text-blue-500 text-xs mt-1">↑ 8% vs last month</div>
        </div>
        <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <AlertTriangle size={16} />
            <span className="text-sm">Dispute Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">0.2%</div>
          <div className="text-green-500 text-xs mt-1">Stable (Low)</div>
        </div>
      </div>
    </div>
  );
};

export default AgentAnalytics;
