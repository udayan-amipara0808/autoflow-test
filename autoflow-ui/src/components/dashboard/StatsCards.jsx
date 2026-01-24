import React from 'react';
import { ListTodo, Server, DollarSign, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, subValue, trend, trendValue, icon: Icon, color }) => (
  <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
    <div className={"absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity " + color}>
      <Icon size={64} />
    </div>

    <div className="flex justify-between items-start mb-4">
      <div className={"p-3 rounded-lg bg-opacity-20 " + color.replace('text-', 'bg-')}>
        <Icon size={24} className={color} />
      </div>
      <div className={"flex items-center gap-1 text-sm font-medium " + (trend === 'up' ? 'text-green-400' : 'text-red-400')}>
        {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        {trendValue}
      </div>
    </div>

    <div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xs text-gray-500 mt-2">{subValue}</p>
    </div>
  </div>
);

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Tasks"
        value="1,284"
        subValue="+124 today"
        trend="up"
        trendValue="12.5%"
        icon={ListTodo}
        color="text-blue-500"
      />
      <StatsCard
        title="Active Nodes"
        value="87"
        subValue="93.7% Online"
        trend="up"
        trendValue="4.2%"
        icon={Server}
        color="text-purple-500"
      />
      <StatsCard
        title="Total Volume"
        value="45.2k"
        subValue="≈ $6.8M USD"
        trend="up"
        trendValue="8.1%"
        icon={DollarSign}
        color="text-green-500"
      />
      <StatsCard
        title="Success Rate"
        value="99.8%"
        subValue="Last 24 hours"
        trend="down"
        trendValue="0.1%"
        icon={CheckCircle}
        color="text-primary-500"
      />
    </div>
  );
};

export default StatsCards;
