import React, { useState, useEffect, useRef } from 'react';
import { FileText, ArrowRight, CheckCircle, DollarSign, Power, PowerOff, Pause, Play, Filter } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatTime } from '../../utils/formatters';

const ActivityFeed = () => {
    const { events } = useWebSocket();
    const [isPaused, setIsPaused] = useState(false);
    const [filter, setFilter] = useState('All');
    const scrollRef = useRef(null);

    const [displayEvents, setDisplayEvents] = useState([]);

    useEffect(() => {
        if (!isPaused) {
            setDisplayEvents(events);
        }
    }, [events, isPaused]);

    const getEventIcon = (type) => {
        switch (type) {
            case 'task_submitted': return <FileText size={16} className="text-blue-400" />;
            case 'task_assigned': return <ArrowRight size={16} className="text-purple-400" />;
            case 'task_completed': return <CheckCircle size={16} className="text-green-400" />;
            case 'payment_released': return <DollarSign size={16} className="text-yellow-400" />;
            case 'node_online': return <Power size={16} className="text-green-500" />;
            case 'node_offline': return <PowerOff size={16} className="text-red-500" />;
            default: return <FileText size={16} className="text-gray-400" />;
        }
    };

    const getEventColor = (type) => {
        const base = "flex items-start p-3 rounded-lg border transition-all animate-slide-in hover:translate-x-1 ";
        let color = '';
        switch (type) {
            case 'task_submitted': color = 'bg-blue-500/10 border-blue-500/20'; break;
            case 'task_assigned': color = 'bg-purple-500/10 border-purple-500/20'; break;
            case 'task_completed': color = 'bg-green-500/10 border-green-500/20'; break;
            case 'payment_released': color = 'bg-yellow-500/10 border-yellow-500/20'; break;
            case 'node_online': color = 'bg-green-500/10 border-green-500/20'; break;
            case 'node_offline': color = 'bg-red-500/10 border-red-500/20'; break;
            default: color = 'bg-dark-800 border-dark-700'; break;
        }
        return base + color;
    };

    return (
        <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg flex flex-col h-[500px]">
            <div className="p-4 border-b border-dark-800 flex justify-between items-center bg-dark-900/50 backdrop-blur top-0 z-10 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <h2 className="font-bold text-white">Live Activity</h2>
                    <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-400 font-medium">LIVE</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
                        title={isPaused ? "Resume Updates" : "Pause Updates"}
                    >
                        {isPaused ? <Play size={16} /> : <Pause size={16} />}
                    </button>

                    <div className="relative group">
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors flex items-center gap-2">
                            <Filter size={16} />
                            <span className="text-xs font-medium">{filter}</span>
                        </button>
                        {/* Simple Dropdown for demo */}
                        <div className="absolute right-0 top-full mt-1 w-32 bg-dark-800 border border-dark-700 rounded-lg shadow-xl hidden group-hover:block z-20">
                            {['All', 'Tasks', 'Payments', 'Nodes'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white first:rounded-t-lg last:rounded-b-lg"
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth custom-scrollbar"
            >
                {displayEvents.map((event) => (
                    <div
                        key={event.id}
                        className={getEventColor(event.type)}
                    >
                        <div className="mt-1 flex-shrink-0">
                            {getEventIcon(event.type)}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">
                                {event.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 font-mono">
                                    {formatTime(event.timestamp)}
                                </span>
                                {event.txHash && (
                                    <a href="#" className="text-xs text-primary-400 hover:underline">
                                        TX: {event.txHash.substring(0, 6)}...
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {displayEvents.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <p>No activity yet...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
