import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Zap, Target, Server } from 'lucide-react';
import { mockNodes } from '../../utils/mockData';

const NodeSelectionVisualizer = () => {
    const [expanded, setExpanded] = useState(true);
    const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);

    // Take top 3 nodes for visualization
    const candidates = mockNodes.slice(0, 3).map((node, i) => ({
        ...node,
        score: (Math.random() * 20 + 70).toFixed(1),
        latencyScore: (Math.random() * 25).toFixed(1),
        costScore: (Math.random() * 25).toFixed(1),
        loadScore: (Math.random() * 25).toFixed(1),
        repScore: (Math.random() * 25).toFixed(1),
    })).sort((a, b) => b.score - a.score);

    useEffect(() => {
        // Animate selection
        const timer = setTimeout(() => {
            setSelectedNodeIndex(0);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const getContainerClass = (idx) => {
        const base = "relative border rounded-xl p-4 transition-all duration-500 ";
        const active = "bg-primary-900/10 border-primary-500 scale-[1.02] shadow-lg shadow-primary-500/10";
        const inactive = "bg-dark-800 border-dark-700 opacity-60";
        return base + (selectedNodeIndex === idx ? active : inactive);
    };

    if (!expanded) {
        return (
            <button
                onClick={() => setExpanded(true)}
                className="w-full bg-dark-900 hover:bg-dark-800 border border-dark-700 rounded-lg p-4 flex items-center justify-between transition-colors shadow-lg"
            >
                <span className="font-bold text-white flex items-center gap-2">
                    <Target size={18} className="text-primary-500" />
                    Orchestrator Decision Visualizer
                </span>
                <ChevronDown size={20} className="text-gray-400" />
            </button>
        );
    }

    return (
        <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg overflow-hidden animate-fade-in">
            <div
                onClick={() => setExpanded(false)}
                className="bg-dark-800 p-4 border-b border-dark-700 flex justify-between items-center cursor-pointer hover:bg-dark-750 transition-colors"
            >
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Target size={18} className="text-primary-500" />
                    Orchestrator Decision Logic
                </h3>
                <ChevronDown size={20} className="text-gray-400 rotate-180" />
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 text-dark-900 font-bold flex items-center justify-center text-xs">1</div>
                        <span className="text-gray-300">Filtering</span>
                        <ChevronRight size={14} className="text-gray-600" />
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs animate-pulse">2</div>
                        <span className="text-white font-medium">Scoring</span>
                        <ChevronRight size={14} className="text-gray-600" />
                        <div className="w-6 h-6 rounded-full bg-dark-700 text-gray-400 font-bold flex items-center justify-center text-xs">3</div>
                        <span className="text-gray-500">Selection</span>
                    </div>

                    <div className="bg-dark-800 px-3 py-1 rounded-lg text-xs font-mono text-gray-400 border border-dark-700">
                        Algorithm: Weighted-KNN-v2
                    </div>
                </div>

                <div className="space-y-4">
                    {candidates.map((node, idx) => (
                        <div
                            key={node.id}
                            className={getContainerClass(idx)}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Server size={18} className={selectedNodeIndex === idx ? 'text-primary-400' : 'text-gray-500'} />
                                    <span className="font-bold text-white">{node.id}</span>
                                    {selectedNodeIndex === idx && (
                                        <span className="bg-primary-500 text-dark-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Zap size={10} fill="currentColor" /> WINNER
                                        </span>
                                    )}
                                </div>
                                <div className="text-2xl font-bold font-mono text-white">
                                    {node.score}
                                </div>
                            </div>

                            {/* Score Visualization Bars */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="w-16 text-gray-400 text-right">Latency</span>
                                    <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: ((node.latencyScore / 25) * 100) + '%' }} />
                                    </div>
                                    <span className="w-8 text-right font-mono text-gray-300">{node.latencyScore}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="w-16 text-gray-400 text-right">Cost</span>
                                    <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: ((node.costScore / 25) * 100) + '%' }} />
                                    </div>
                                    <span className="w-8 text-right font-mono text-gray-300">{node.costScore}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="w-16 text-gray-400 text-right">Load</span>
                                    <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: ((node.loadScore / 25) * 100) + '%' }} />
                                    </div>
                                    <span className="w-8 text-right font-mono text-gray-300">{node.loadScore}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="w-16 text-gray-400 text-right">Reputation</span>
                                    <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500" style={{ width: ((node.repScore / 25) * 100) + '%' }} />
                                    </div>
                                    <span className="w-8 text-right font-mono text-gray-300">{node.repScore}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NodeSelectionVisualizer;
