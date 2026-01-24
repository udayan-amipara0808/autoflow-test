import React from 'react';
import { Activity, Server, Cpu, Link, AlertTriangle, Check, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const StatusRow = ({ icon: Icon, label, status, metric, subMetric, color }) => (
  <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700">
    <div className="flex items-center gap-4">
      <div className={"p-2 rounded-lg " + color.bg}>
        <Icon size={20} className={color.text} />
      </div>
      <div>
        <div className="font-medium text-gray-200">{label}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          {status === 'Healthy' && <Check size={10} className="text-green-500" />}
          {status}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-bold text-white font-mono">{metric}</div>
      <div className="text-xs text-gray-500">{subMetric}</div>
    </div>
  </div>
);

const NetworkStatus = () => {
  // Mock data for sparklines
  const tpsData = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: 800 + Math.random() * 200
  }));

  const latencyData = Array.from({ length: 10 }, (_, i) => ({
    name: "Node " + (i + 1),
    value: 20 + Math.random() * 80
  }));

  return (
    <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg p-6 flex flex-col h-[500px]">
      <h2 className="font-bold text-white mb-6 flex items-center gap-2">
        <Activity size={20} className="text-primary-500" />
        System Health
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <StatusRow
          icon={Link}
          label="Monad L1"
          status="Healthy"
          metric="1,234,567"
          subMetric="Block Height"
          color={{ bg: 'bg-green-500/10', text: 'text-green-500' }}
        />
        <StatusRow
          icon={Server}
          label="NodeOps"
          status="Healthy"
          metric="127 / 135"
          subMetric="Nodes Online"
          color={{ bg: 'bg-blue-500/10', text: 'text-blue-500' }}
        />
        <StatusRow
          icon={Cpu}
          label="Orchestrator"
          status="Healthy"
          metric="99.98%"
          subMetric="Uptime"
          color={{ bg: 'bg-purple-500/10', text: 'text-purple-500' }}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-400">Transaction Throughput</h3>
          <span className="text-xs bg-dark-800 px-2 py-1 rounded text-primary-400">847 TPS</span>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tpsData}>
              <defs>
                <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
