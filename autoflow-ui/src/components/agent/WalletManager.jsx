import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, RefreshCw } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { formatAmount } from '../../utils/formatters';

const WalletManager = () => {
    const { balance, address } = useWallet();
    const [activeTab, setActiveTab] = useState('deposit');

    const getTabClass = (tab) => {
        const base = "flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ";
        return base + (activeTab === tab ? 'bg-dark-700 text-white shadow' : 'text-gray-400 hover:text-white');
    };

    const formattedAddress = address
        ? address.substring(0, 6) + "..." + address.substring(address.length - 4)
        : 'Not Connected';

    return (
        <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-white flex items-center gap-2">
                    <Wallet className="text-primary-500" />
                    Wallet Manager
                </h2>
                <span className="text-xs font-mono text-gray-500 bg-dark-800 px-2 py-1 rounded">
                    {formattedAddress}
                </span>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-primary-900/50 to-blue-900/50 border border-primary-500/30 rounded-xl p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                    <CreditCard size={120} className="text-white" />
                </div>

                <div className="relative z-10">
                    <div className="text-primary-300 text-sm font-medium mb-1">Total Balance</div>
                    <div className="text-4xl font-bold text-white mb-2">{formatAmount(balance)} <span className="text-lg font-normal text-primary-200">MON</span></div>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1 text-gray-300">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Available: {formatAmount(balance * 0.8)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-300">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Locked in Escrow: {formatAmount(balance * 0.2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex bg-dark-800 rounded-lg p-1 mb-4">
                <button
                    onClick={() => setActiveTab('deposit')}
                    className={getTabClass('deposit')}
                >
                    <ArrowDownLeft size={16} />
                    Deposit
                </button>
                <button
                    onClick={() => setActiveTab('withdraw')}
                    className={getTabClass('withdraw')}
                >
                    <ArrowUpRight size={16} />
                    Withdraw
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (MON)</label>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                        />
                        <button className="absolute right-2 top-2 text-xs bg-dark-700 hover:bg-dark-600 px-2 py-1 rounded text-primary-400 transition-colors">
                            MAX
                        </button>
                    </div>
                </div>

                {activeTab === 'withdraw' && (
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-primary-500 outline-none font-mono text-sm"
                        />
                    </div>
                )}

                <div className="bg-dark-800 rounded-lg p-3 text-xs text-gray-400 flex justify-between">
                    <span>Gas Fee Estimate</span>
                    <span className="text-white font-mono">~0.00042 MON</span>
                </div>

                <button className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary-500/20">
                    {activeTab === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}
                </button>
            </div>
        </div>
    );
};

export default WalletManager;
