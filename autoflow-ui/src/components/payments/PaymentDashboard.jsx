import React from 'react';
import { Lock, Cpu, CheckCircle, DollarSign, Clock, Receipt, ArrowRight } from 'lucide-react';

const PaymentDashboard = () => {
    return (
        <div className="space-y-6">
            {/* Flow Visualization */}
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-8 shadow-lg overflow-x-auto">
                <h2 className="font-bold text-white mb-8">Payment Settlement Flow</h2>
                <div className="flex items-center justify-between min-w-[600px] relative">

                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-dark-800 -z-10 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-gradient-to-r from-primary-900 to-primary-500 -z-10 transform -translate-y-1/2 animate-pulse"></div>

                    <div className="flex flex-col items-center gap-4 relative z-10 group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-dark-800 border-2 border-primary-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-transform hover:scale-110">
                            <Lock size={28} className="text-primary-400" />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-white">Escrow Locked</div>
                            <div className="text-xs text-primary-400 font-mono">245.50 MON</div>
                        </div>
                    </div>

                    <ArrowRight size={24} className="text-dark-600" />

                    <div className="flex flex-col items-center gap-4 relative z-10 group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-dark-800 border-2 border-primary-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse transition-transform hover:scale-110">
                            <Cpu size={28} className="text-primary-400" />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-white">Task Executing</div>
                            <div className="text-xs text-primary-400 font-mono">3 Active</div>
                        </div>
                    </div>

                    <ArrowRight size={24} className="text-dark-600" />

                    <div className="flex flex-col items-center gap-4 relative z-10 group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-dark-800 border-2 border-dark-600 flex items-center justify-center transition-transform hover:scale-110 opacity-70">
                            <CheckCircle size={28} className="text-gray-400" />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-gray-400">Verifying</div>
                            <div className="text-xs text-gray-500 font-mono">--</div>
                        </div>
                    </div>

                    <ArrowRight size={24} className="text-dark-600" />

                    <div className="flex flex-col items-center gap-4 relative z-10 group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-dark-800 border-2 border-dark-600 flex items-center justify-center transition-transform hover:scale-110 opacity-70">
                            <DollarSign size={28} className="text-gray-400" />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-gray-400">Release</div>
                            <div className="text-xs text-gray-500 font-mono">--</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-dark-900 border border-dark-700 p-6 rounded-xl shadow hover:border-primary-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-cyan-900/30 rounded-lg">
                            <Lock size={24} className="text-cyan-400" />
                        </div>
                        <span className="text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded text-xs">Active</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-mono">1,245.00</h3>
                    <p className="text-sm text-gray-400">Total Escrowed (MON)</p>
                </div>

                <div className="bg-dark-900 border border-dark-700 p-6 rounded-xl shadow hover:border-green-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-900/30 rounded-lg">
                            <CheckCircle size={24} className="text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-mono">45.2K</h3>
                    <p className="text-sm text-gray-400">Total Settled (MON)</p>
                </div>

                <div className="bg-dark-900 border border-dark-700 p-6 rounded-xl shadow hover:border-gray-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-800 rounded-lg">
                            <Receipt size={24} className="text-gray-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-mono">128.40</h3>
                    <p className="text-sm text-gray-400">Platform Fees Paid</p>
                </div>

                <div className="bg-dark-900 border border-dark-700 p-6 rounded-xl shadow hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-900/30 rounded-lg">
                            <Clock size={24} className="text-blue-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">2.4s</h3>
                    <p className="text-sm text-gray-400">Avg Settlement Time</p>
                </div>
            </div>

            {/* Micropayment Batching */}
            <div className="bg-gradient-to-r from-dark-900 to-dark-800 border border-dark-700 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Receipt className="text-purple-400" />
                        Micropayment Batching
                    </h3>
                    <p className="text-sm text-gray-400">Accumulating small payments to save gas</p>
                </div>

                <div className="flex items-center gap-8 flex-1 justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">47</div>
                        <div className="text-xs text-gray-500">Pending Payments</div>
                    </div>
                    <div className="h-10 w-px bg-dark-700"></div>
                    <div className="text-center">
                        <div className="text-2xl font-mono text-primary-400">00:23</div>
                        <div className="text-xs text-gray-500">Next Batch</div>
                    </div>
                    <div className="h-10 w-px bg-dark-700"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">68%</div>
                        <div className="text-xs text-gray-500">Gas Saved</div>
                    </div>
                </div>

                <div className="w-full md:w-64">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">Queue Fill</span>
                        <span className="text-purple-400">76%</span>
                    </div>
                    <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[76%] rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDashboard;
