import React, { useState } from 'react';
import { Settings as SettingsIcon, Trash2, Coins, AlertTriangle, Save, Loader2 } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

const SettingsPage = () => {
    const { address, connected, disconnect } = useWallet();
    const [maxTokenLimit, setMaxTokenLimit] = useState('100');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveStatus(null);

        // Simulate saving (in real app, save to backend/localStorage)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Save to localStorage
        localStorage.setItem('autoflow_max_token_limit', maxTokenLimit);

        setSaveStatus({ type: 'success', message: 'Settings saved!' });
        setIsSaving(false);
    };

    const handleDeleteAccount = async () => {
        // Clear all local data
        localStorage.clear();

        // Disconnect wallet
        if (disconnect) {
            disconnect();
        }

        // Reload page
        window.location.reload();
    };

    // Load saved settings on mount
    React.useEffect(() => {
        const savedLimit = localStorage.getItem('autoflow_max_token_limit');
        if (savedLimit) {
            setMaxTokenLimit(savedLimit);
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <SettingsIcon className="text-primary-500" />
                    Settings
                </h2>
                <p className="text-gray-400">Manage your account and preferences</p>
            </div>

            {/* Token Limit Settings */}
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Coins className="text-yellow-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Token Limits</h3>
                        <p className="text-sm text-gray-400">Control maximum MON token usage</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Max Token Limit per Task (MON)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0.01"
                            value={maxTokenLimit}
                            onChange={(e) => setMaxTokenLimit(e.target.value)}
                            className="w-full md:w-64 bg-dark-800 border border-dark-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Maximum MON tokens that can be locked in escrow per task
                        </p>
                    </div>

                    <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Settings
                            </>
                        )}
                    </button>

                    {saveStatus && (
                        <div className="text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg inline-block">
                            {saveStatus.message}
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-dark-900 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Danger Zone</h3>
                        <p className="text-sm text-gray-400">Irreversible actions</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-dark-800 rounded-lg border border-red-500/20">
                        <div>
                            <h4 className="font-medium text-white">Delete Account Data</h4>
                            <p className="text-sm text-gray-400">
                                Remove all local data and disconnect wallet. This won't affect your on-chain data.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                        >
                            <Trash2 size={18} />
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowDeleteConfirm(false)}>
                        <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <AlertTriangle className="text-red-500" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                            </div>

                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete all local account data? This will:
                            </p>
                            <ul className="list-disc list-inside text-gray-400 mb-6 space-y-1">
                                <li>Clear all saved settings</li>
                                <li>Disconnect your wallet</li>
                                <li>Reset the application</li>
                            </ul>
                            <p className="text-sm text-yellow-400 mb-6">
                                Note: Your on-chain funds and transactions are safe and unaffected.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Account Info */}
            {connected && (
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Connected Account</h3>
                    <div className="bg-dark-800 rounded-lg p-4 font-mono text-sm text-gray-300 break-all">
                        {address}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
