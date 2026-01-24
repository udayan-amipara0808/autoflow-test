import React, { useState } from 'react';
import { Server, Globe, Search, Filter } from 'lucide-react';
import NodeCard from './NodeCard';
import { mockNodes } from '../../utils/mockData';

const NodeHealthDashboard = () => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNodes = mockNodes.filter(node => {
        const matchesFilter = filter === 'All' ||
            (filter === 'Online' && (node.status === 'Online' || node.status === 'Busy')) ||
            (filter === 'Offline' && node.status === 'Offline');
        const matchesSearch = node.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getFilterButtonClass = (f) => {
        const base = "px-4 py-2 rounded-lg text-sm font-medium transition-all ";
        return base + (filter === f ? 'bg-primary-500 text-white' : 'bg-dark-900 text-gray-400 hover:text-white');
    };

    return (
        <div className="space-y-6">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl shadow">
                    <div className="text-gray-400 text-sm mb-1">Total Nodes</div>
                    <div className="text-2xl font-bold text-white">127</div>
                </div>
                <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl shadow">
                    <div className="text-gray-400 text-sm mb-1">Online</div>
                    <div className="text-2xl font-bold text-green-400">114 <span className="text-sm text-gray-500 font-normal">90%</span></div>
                </div>
                <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl shadow">
                    <div className="text-gray-400 text-sm mb-1">Total Capacity</div>
                    <div className="text-2xl font-bold text-blue-400">1,024 <span className="text-sm text-gray-500 font-normal">vCPUs</span></div>
                </div>
                <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl shadow">
                    <div className="text-gray-400 text-sm mb-1">Avg Latency</div>
                    <div className="text-2xl font-bold text-purple-400">45ms</div>
                </div>
            </div>

            {/* World Map Visualization (Simplified) */}
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 shadow-lg h-64 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 100 50" className="w-full h-full fill-primary-500">
                        {/* Abstract map dots */}
                        {Array.from({ length: 50 }).map((_, i) => (
                            <circle key={i} cx={Math.random() * 100} cy={Math.random() * 50} r="0.5" />
                        ))}
                    </svg>
                </div>
                <div className="z-10 text-center">
                    <Globe size={48} className="text-primary-500/30 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Global Node Network Visualization</p>
                    <div className="flex gap-4 mt-4 justify-center">
                        {['US-East', 'EU-West', 'Asia-Pacific'].map(region => (
                            <div key={region} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-gray-300">{region}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-9 p-2 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                    />
                </div>

                <div className="flex gap-2">
                    {['All', 'Online', 'Offline'].map(f => (
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

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNodes.map(node => (
                    <NodeCard key={node.id} node={node} />
                ))}
            </div>
        </div>
    );
};

export default NodeHealthDashboard;
