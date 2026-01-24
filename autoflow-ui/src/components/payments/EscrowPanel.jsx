import React, { useState } from 'react';
import { Lock, Clock, AlertTriangle, ExternalLink, ShieldAlert, Check } from 'lucide-react';
import { formatAmount } from '../../utils/formatters';

const EscrowPanel = () => {
    const [selectedEscrow, setSelectedEscrow] = useState(null);

    const escrows = [
        { id: 'esc-123', taskId: 'Task-#7f3a', amount: 50.00, lockedAt: new Date().toISOString(), status: 'Active', expiry: 72 },
        { id: 'esc-456', taskId: 'Task-#9b2c', amount: 120.50, lockedAt: new Date(Date.now() - 3600000).toISOString(), status: 'Active', expiry: 71 },
        { id: 'esc-789', taskId: 'Task-#3a1b', amount: 15.00, lockedAt: new Date(Date.now() - 7200000).toISOString(), status: 'Releasing', expiry: 70 },
    ];

    const getCardClass = (escrow) => {
        const base = "p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 ";
        const active = "bg-primary-900/10 border-primary-500 shadow-[0_0_10px_rgba(6,182,212,0.1)]";
        const inactive = "bg-dark-800/50 border-dark-700 hover:border-dark-600";
        return base + (selectedEscrow?.id === escrow.id ? active : inactive);
    };

    const getStatusClass = (status) => {
        const base = "px-2 py-0.5 rounded text-xs font-bold ";
        return base + (status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 bg-dark-900 border border-dark-700 rounded-xl shadow-lg p-6">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-primary-500" />
                    Active Escrows
                </h2>

                <div className="space-y-3">
                    {escrows.map((escrow) => (
                        <div
                            key={escrow.id}
                            onClick={() => setSelectedEscrow(escrow)}
                            className={getCardClass(escrow)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-primary-400">{escrow.taskId}</span>
                                <span className={getStatusClass(escrow.status)}>
                                    {escrow.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-2xl font-bold text-white font-mono">{formatAmount(escrow.amount)} <span className="text-sm text-gray-500">MON</span></div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <Clock size={10} /> Expires in {escrow.expiry}h
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 rounded-lg text-xs font-medium text-gray-300 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Details / Contract Info */}
            <div className="space-y-6">
                {/* Contract Info */}
                <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg p-6">
                    <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Smart Contract</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Contract Address</div>
                            <div className="flex items-center gap-2 bg-dark-800 p-2 rounded font-mono text-sm text-gray-300">
                                0x8f...3a2b
                                <Check size={14} className="text-green-500" />
                            </div>
                            <a href="#" className="text-xs text-primary-400 hover:underline mt-1 inline-flex items-center gap-1">
                                View on Monad Explorer <ExternalLink size={10} />
                            </a>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Verified Events</div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-300">Lock</span>
                                    <span className="font-mono text-gray-500">Block #12345</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-300">Release</span>
                                    <span className="font-mono text-gray-500">Block #12348</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedEscrow && (
                    <div className="bg-dark-800 border-2 border-primary-500/30 rounded-xl shadow-lg p-6 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Lock size={64} />
                        </div>

                        <h3 className="font-bold text-white mb-4">Actions</h3>

                        <div className="space-y-3">
                            <button className="w-full py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-gray-300 transition-colors border border-dark-600 flex items-center justify-center gap-2" disabled>
                                Release Payment
                                <Lock size={14} />
                            </button>

                            <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors border border-red-500/20 flex items-center justify-center gap-2">
                                <ShieldAlert size={14} />
                                Open Dispute
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-200">
                                    Funds are locked by the smart contract until the node submits verified proof of work.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EscrowPanel;
