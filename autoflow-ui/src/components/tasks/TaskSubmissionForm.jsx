import React, { useState } from 'react';
import { Cpu, Zap, Clock, DollarSign, Database, Code, Globe, AlertCircle, ArrowRight } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

const TaskSubmissionForm = () => {
    const { connected, balance, connect } = useWallet();
    const [formData, setFormData] = useState({
        type: 'AI Inference',
        description: '',
        cpu: 4,
        ram: 16,
        gpu: false,
        budget: 50,
        priority: 'Medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'AI Inference': return <Cpu className="w-5 h-5" />;
            case 'Data Processing': return <Database className="w-5 h-5" />;
            case 'API Call': return <Globe className="w-5 h-5" />;
            default: return <Code className="w-5 h-5" />;
        }
    };

    const calculateEscrow = () => {
        return (formData.budget * 1.1).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!connected) return;
        setIsSubmitting(true);
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        // Show success toast (handled by parent/context ideally, but here just reset)
        setFormData({ ...formData, description: '' });
    };

    const getButtonClass = (type) => {
        const base = "flex flex-col items-center justify-center p-4 rounded-xl border transition-all ";
        const active = "bg-primary-500/20 border-primary-500 text-primary-400";
        const inactive = "bg-dark-800 border-dark-700 text-gray-400 hover:bg-dark-700";
        return base + (formData.type === type ? active : inactive);
    };

    const getPriorityClass = (p) => {
        const base = "flex-1 py-2 rounded-lg text-sm font-medium border transition-all ";
        if (formData.priority !== p) return base + "bg-dark-800 border-dark-700 text-gray-400";
        if (p === 'High') return base + "bg-red-500/20 border-red-500 text-red-500";
        if (p === 'Medium') return base + "bg-yellow-500/20 border-yellow-500 text-yellow-500";
        return base + "bg-blue-500/20 border-blue-500 text-blue-500";
    };

    const getGpuClass = () => {
        const base = "w-12 h-6 rounded-full transition-colors relative ";
        return base + (formData.gpu ? 'bg-primary-500' : 'bg-dark-600');
    };

    const getGpuToggleClass = () => {
        const base = "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ";
        return base + (formData.gpu ? 'left-7' : 'left-1');
    };

    return (
        <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="text-primary-500" />
                    Submit New Task
                </h2>
                {connected && (
                    <div className="text-sm text-gray-400">
                        Balance: <span className="text-white font-mono">{balance} MONAD</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task Type */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['AI Inference', 'Data Processing', 'API Call', 'Custom'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type })}
                            className={getButtonClass(type)}
                        >
                            {getTypeIcon(type)}
                            <span className="mt-2 text-sm font-medium">{type}</span>
                        </button>
                    ))}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Task Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                        rows="3"
                        placeholder="Describe the workload requirements..."
                    />
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">CPU Cores</label>
                        <div className="flex items-center gap-3 bg-dark-800 rounded-lg p-1 border border-dark-700">
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, cpu: Math.max(1, p.cpu - 1) }))}
                                className="w-8 h-8 flex items-center justify-center bg-dark-700 rounded text-white hover:bg-dark-600"
                            >
                                -
                            </button>
                            <span className="flex-1 text-center font-mono text-white">{formData.cpu}</span>
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, cpu: p.cpu + 1 }))}
                                className="w-8 h-8 flex items-center justify-center bg-dark-700 rounded text-white hover:bg-dark-600"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">RAM (GB)</label>
                        <input
                            type="number"
                            value={formData.ram}
                            onChange={(e) => setFormData({ ...formData, ram: parseInt(e.target.value) })}
                            className="w-full bg-dark-800 border border-dark-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between bg-dark-800 p-3 rounded-lg border border-dark-700 h-[74px]">
                        <span className="text-sm font-medium text-gray-300">GPU Required</span>
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, gpu: !p.gpu }))}
                            className={getGpuClass()}
                        >
                            <div className={getGpuToggleClass()} />
                        </button>
                    </div>
                </div>

                {/* Budget & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Budget ($USD)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="number"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                                className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-9 p-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                        <div className="flex gap-2">
                            {['Low', 'Medium', 'High'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: p })}
                                    className={getPriorityClass(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Box */}
                <div className="bg-dark-950/50 rounded-lg p-4 border border-dark-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-500/10 rounded-full">
                            <Clock size={20} className="text-primary-400" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Est. Time</div>
                            <div className="font-medium text-white">~45 seconds</div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-dark-700 hidden md:block" />

                    <div className="text-right">
                        <div className="text-sm text-gray-400">Total Escrow Required (incl. buffer)</div>
                        <div className="text-xl font-bold text-white flex items-center justify-end gap-1">
                            {calculateEscrow()} <span className="text-sm font-normal text-gray-500">MONAD</span>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                {!connected ? (
                    <button
                        type="button"
                        onClick={connect}
                        className="w-full py-4 bg-dark-700 hover:bg-dark-600 text-gray-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Connect Wallet to Submit
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={isSubmitting || balance < parseFloat(calculateEscrow())}
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Submit & Lock Escrow
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                )}

                {connected && balance < parseFloat(calculateEscrow()) && (
                    <div className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-500/10 p-2 rounded-lg">
                        <AlertCircle size={16} />
                        Insufficient balance
                    </div>
                )}
            </form>
        </div>
    );
};

export default TaskSubmissionForm;
