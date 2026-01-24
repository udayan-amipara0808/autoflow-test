import React from 'react';
import { X, Copy, Terminal, Activity, DollarSign, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const TaskDetailModal = ({ task, onClose }) => {
    if (!task) return null;

    const getStatusBadgeClass = () => {
        const base = "px-3 py-1 rounded-full text-xs font-bold ";
        if (task.status === 'Completed') return base + 'bg-green-500/20 text-green-400';
        if (task.status === 'Executing') return base + 'bg-purple-500/20 text-purple-400';
        if (task.status === 'Failed') return base + 'bg-red-500/20 text-red-400';
        return base + 'bg-yellow-500/20 text-yellow-400';
    };

    const getStepIndicatorClass = (step) => {
        const base = "absolute -left-[31px] w-4 h-4 rounded-full border-2 ";
        if (step.done) return base + "bg-green-500 border-green-500";
        if (step.active) return base + "bg-dark-900 border-primary-500 animate-pulse";
        return base + "bg-dark-900 border-dark-600";
    };

    const getStepTextClass = (step) => {
        return "font-medium " + (step.active ? 'text-white' : 'text-gray-500');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-dark-900 border border-dark-700 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-dark-800 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-white font-mono">Task #{task.id}</h2>
                            <button className="text-gray-500 hover:text-white transition-colors">
                                <Copy size={16} />
                            </button>
                            <span className={getStatusBadgeClass()}>
                                {task.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-gray-400">{task.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-dark-800 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Tabs */}
                <div className="flex border-b border-dark-800 px-6">
                    <button className="px-4 py-4 border-b-2 border-primary-500 text-primary-400 font-medium text-sm">Overview</button>
                    <button className="px-4 py-4 border-b-2 border-transparent text-gray-400 hover:text-white font-medium text-sm">Execution Logs</button>
                    <button className="px-4 py-4 border-b-2 border-transparent text-gray-400 hover:text-white font-medium text-sm">Payment Info</button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                            <div className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Node Assigned</div>
                            <div className="flex items-center gap-2 text-white font-mono text-lg">
                                {task.nodeId || 'Searching...'}
                                {task.nodeId && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                            </div>
                        </div>
                        <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                            <div className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Compute Power</div>
                            <div className="flex gap-2">
                                <span className="bg-dark-700 px-2 py-1 rounded text-xs text-gray-300">{task.computeRequirements.cpu} vCPU</span>
                                <span className="bg-dark-700 px-2 py-1 rounded text-xs text-gray-300">{task.computeRequirements.ram} GB RAM</span>
                                {task.computeRequirements.gpu && <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded text-xs">GPU</span>}
                            </div>
                        </div>
                        <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                            <div className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Escrow Locked</div>
                            <div className="flex items-center gap-2 text-white font-mono text-lg text-green-400">
                                <DollarSign size={16} />
                                {task.escrowAmount} MON
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Timeline */}
                        <div className="lg:col-span-1">
                            <h3 className="font-bold text-white mb-4">Timeline</h3>
                            <div className="border-l-2 border-dark-700 ml-3 space-y-8 pl-6 relative">
                                {[
                                    { status: 'Task Submitted', time: '10:00 AM', active: true, done: true },
                                    { status: 'Escrow Locked', time: '10:01 AM', active: true, done: true },
                                    { status: 'Node Assigned', time: '10:02 AM', active: true, done: true },
                                    { status: 'Execution Started', time: '10:02 AM', active: task.status !== 'Pending' && task.status !== 'Routing', done: task.status === 'Completed' },
                                    { status: 'Results Verified', time: '-', active: task.status === 'Completed', done: task.status === 'Completed' },
                                    { status: 'Payment Released', time: '-', active: task.status === 'Completed', done: task.status === 'Completed' },
                                ].map((step, i) => (
                                    <div key={i} className="relative">
                                        <span className={getStepIndicatorClass(step)}>
                                            {step.done && <CheckCircle size={10} className="text-white absolute top-0 left-0" />}
                                        </span>
                                        <div className={getStepTextClass(step)}>{step.status}</div>
                                        <div className="text-xs text-gray-500">{step.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Terminal */}
                        <div className="lg:col-span-2 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Terminal size={18} />
                                    Execution Output
                                </h3>
                                <span className="text-xs text-gray-500">Live Stream</span>
                            </div>
                            <div className="bg-black/80 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto border border-dark-700 shadow-inner">
                                <div className="text-green-400">$ initializing environment...</div>
                                <div className="text-gray-400 text-xs mb-2">10:02:15 AM [SYSTEM] Container started</div>
                                <div className="text-white">Pulling docker image user/ai-model:latest...</div>
                                <div className="text-white">Verifying hash integrity... OK</div>
                                <div className="text-white">Allocating GPU resources...</div>
                                <div className="text-yellow-400">Warning: Memory usage high (87%)</div>
                                {task.status === 'Executing' && (
                                    <div className="text-gray-500 animate-pulse">_</div>
                                )}
                                {task.status === 'Completed' && (
                                    <div className="text-green-500 mt-2">
                                        Operation completed successfully. Results stored at ipfs://Qm...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-dark-800 flex justify-end gap-3 bg-dark-900">
                    {task.status === 'Completed' && (
                        <button className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors border border-dark-700">
                            Download Results
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
