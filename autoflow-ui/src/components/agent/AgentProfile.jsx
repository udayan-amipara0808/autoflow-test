import React, { useState } from 'react';
import { User, Key, Bell, Shield, Edit2, Copy, Eye, EyeOff, Save } from 'lucide-react';
import { mockAgent } from '../../utils/mockData';
import WalletManager from './WalletManager';

const AgentProfile = () => {
    const [agent, setAgent] = useState(mockAgent);
    const [showKey, setShowKey] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Identity Card */}
            <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-lg p-6 lg:col-span-2">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 p-1">
                            <div className="w-full h-full bg-dark-900 rounded-full overflow-hidden flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">AA</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                                <button className="p-1 hover:bg-dark-800 rounded-full text-gray-500 hover:text-white transition-colors">
                                    <Edit2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold border border-primary-500/20">
                                    {agent.type}
                                </span>
                                <span className="text-sm text-gray-500">Since Nov 2023</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Reputation Score</div>
                        <div className="text-3xl font-bold text-white flex items-center justify-end gap-1">
                            98
                            <span className="text-sm text-primary-500 font-normal">/100</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-dark-800">
                    {/* API Keys */}
                    <div>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Key size={18} className="text-gray-400" />
                            API Credentials
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">API Key</label>
                                <div className="relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={agent.apiKey}
                                        readOnly
                                        className="w-full bg-dark-800 border border-dark-700 rounded-lg p-2.5 text-sm text-gray-300 pr-20"
                                    />
                                    <div className="absolute right-2 top-2 flex gap-1">
                                        <button
                                            onClick={() => setShowKey(!showKey)}
                                            className="p-1 hover:bg-dark-700 rounded text-gray-400"
                                        >
                                            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button className="p-1 hover:bg-dark-700 rounded text-gray-400">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Webhook URL</label>
                                <input
                                    type="text"
                                    placeholder="https://your-api.com/webhooks"
                                    className="w-full bg-dark-800 border border-dark-700 rounded-lg p-2.5 text-sm text-gray-300 focus:ring-1 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Bell size={18} className="text-gray-400" />
                            Notifications & Settings
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-dark-800/50 rounded-lg">
                                <span className="text-sm text-gray-300">Email Notifications</span>
                                <div className="w-10 h-5 bg-primary-600 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-dark-800/50 rounded-lg">
                                <span className="text-sm text-gray-300">Payment Alerts</span>
                                <div className="w-10 h-5 bg-primary-600 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-dark-800/50 rounded-lg">
                                <span className="text-sm text-gray-300">Auto-Approve Tasks</span>
                                <div className="w-10 h-5 bg-dark-600 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-gray-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Wallet Widget */}
            <div className="lg:col-span-1">
                <WalletManager />
            </div>
        </div>
    );
};

export default AgentProfile;
