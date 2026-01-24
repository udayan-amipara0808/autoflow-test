import React, { useState } from 'react';
import { Wallet, X, ChevronDown, ExternalLink, RefreshCw, LogOut } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/formatters';

const WalletConnect = () => {
    const { connected, address, balance, connect, disconnect, isConnecting, network } = useWallet();
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleConnect = async () => {
        await connect();
        setShowModal(false);
    };

    if (connected) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-full px-4 py-2 transition-all"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono text-sm">{formatAddress(address)}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-dark-900 border border-dark-700 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-dark-800 bg-gradient-to-r from-dark-900 to-dark-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-400">Connected Wallet</span>
                                <span className="text-xs text-green-400 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Monad Mainnet
                                </span>
                            </div>
                            <div className="flex flex-col mb-1">
                                <span className="font-bold text-lg text-white font-mono break-all">{address}</span>
                                <span className="text-xs text-gray-500 cursor-pointer hover:text-white" onClick={() => {
                                    navigator.clipboard.writeText(address);
                                    console.log('Manually copied address:', address);
                                    alert('Address copied to clipboard: ' + address);
                                }}>
                                    (Click to Copy & Verify)
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {balance} <span className="text-sm font-normal text-gray-400">MONAD</span>
                            </div>
                            <div className="text-sm text-gray-500">≈ ${(balance * 145.20).toFixed(2)} USD</div>
                        </div>

                        <div className="p-2">
                            <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-300 hover:bg-dark-800 rounded-lg transition-colors">
                                <ExternalLink size={16} />
                                View on Explorer
                            </button>
                            <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-300 hover:bg-dark-800 rounded-lg transition-colors">
                                <RefreshCw size={16} />
                                Switch Network
                            </button>
                            <button
                                onClick={disconnect}
                                className="flex items-center gap-3 w-full p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-2"
                            >
                                <LogOut size={16} />
                                Disconnect
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-400 hover:to-blue-400 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
                <Wallet size={18} />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-[100] pt-24 px-4" onClick={() => setShowModal(false)}>
                    <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-dark-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-dark-800 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 grid gap-4">
                            <button
                                onClick={handleConnect}
                                className="flex items-center justify-between p-4 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-white group-hover:text-primary-400 transition-colors">MetaMask</div>
                                        <div className="text-xs text-gray-500">Browser Extension</div>
                                    </div>
                                </div>
                                <div className="bg-primary-500/10 text-primary-400 text-xs px-2 py-1 rounded font-medium">Popular</div>
                            </button>

                            <button
                                onClick={handleConnect}
                                className="flex items-center justify-between p-4 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Wallet size={20} className="text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-white group-hover:text-primary-400 transition-colors">WalletConnect</div>
                                        <div className="text-xs text-gray-500">Mobile Wallet</div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="p-4 bg-dark-950 text-center border-t border-dark-800">
                            <a href="#" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                                What is a wallet?
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WalletConnect;
