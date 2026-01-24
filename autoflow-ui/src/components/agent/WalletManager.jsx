import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Loader2 } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { formatAmount } from '../../utils/formatters';
import { ethers } from 'ethers';

// PaymentSettlement Contract Address (deployed on Monad Testnet)
const PAYMENT_SETTLEMENT_ADDRESS = '0x5fD4b10bFb57c3D092Fcbfa7b731dE9205544579';

// PaymentSettlement ABI (only the functions we need)
const PAYMENT_SETTLEMENT_ABI = [
    'function deposit() external payable',
    'function withdraw(uint256 amount) external',
    'function getBalance(address user) external view returns (uint256)',
    'event Deposited(address indexed user, uint256 amount)',
    'event Withdrawn(address indexed user, uint256 amount)'
];

const WalletManager = () => {
    const { balance, address, connected } = useWallet();
    const [activeTab, setActiveTab] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [txStatus, setTxStatus] = useState(null);
    const [contractBalance, setContractBalance] = useState('0');

    // Fetch contract balance on load and when address changes
    useEffect(() => {
        if (address && connected) {
            fetchContractBalance();
        }
    }, [address, connected]);

    const fetchContractBalance = async () => {
        try {
            if (!window.ethereum) return;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(PAYMENT_SETTLEMENT_ADDRESS, PAYMENT_SETTLEMENT_ABI, provider);
            const bal = await contract.getBalance(address);
            setContractBalance(ethers.formatEther(bal));
        } catch (error) {
            console.error('Error fetching contract balance:', error);
        }
    };

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setTxStatus({ type: 'error', message: 'Please enter a valid amount' });
            return;
        }

        setIsLoading(true);
        setTxStatus(null);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(PAYMENT_SETTLEMENT_ADDRESS, PAYMENT_SETTLEMENT_ABI, signer);

            const tx = await contract.deposit({
                value: ethers.parseEther(amount)
            });

            setTxStatus({ type: 'pending', message: 'Transaction pending...' });

            await tx.wait();

            setTxStatus({ type: 'success', message: 'Deposit successful!' });
            setAmount('');
            await fetchContractBalance();
        } catch (error) {
            console.error('Deposit error:', error);
            setTxStatus({ type: 'error', message: error.message || 'Transaction failed' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setTxStatus({ type: 'error', message: 'Please enter a valid amount' });
            return;
        }

        setIsLoading(true);
        setTxStatus(null);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(PAYMENT_SETTLEMENT_ADDRESS, PAYMENT_SETTLEMENT_ABI, signer);

            const tx = await contract.withdraw(ethers.parseEther(amount));

            setTxStatus({ type: 'pending', message: 'Transaction pending...' });

            await tx.wait();

            setTxStatus({ type: 'success', message: 'Withdrawal successful!' });
            setAmount('');
            await fetchContractBalance();
        } catch (error) {
            console.error('Withdraw error:', error);
            setTxStatus({ type: 'error', message: error.message || 'Transaction failed' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMaxClick = () => {
        if (activeTab === 'deposit') {
            // Use wallet balance minus a small buffer for gas
            const maxAmount = Math.max(0, parseFloat(balance) - 0.01);
            setAmount(maxAmount.toFixed(4));
        } else {
            // Use contract balance
            setAmount(contractBalance);
        }
    };

    const getTabClass = (tab) => {
        const base = "flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ";
        return base + (activeTab === tab ? 'bg-dark-700 text-white shadow' : 'text-gray-400 hover:text-white');
    };

    const formattedAddress = address
        ? address.substring(0, 6) + "..." + address.substring(address.length - 4)
        : 'Not Connected';

    const getTxStatusClass = () => {
        if (!txStatus) return '';
        if (txStatus.type === 'success') return 'text-green-400 bg-green-500/10';
        if (txStatus.type === 'error') return 'text-red-400 bg-red-500/10';
        return 'text-yellow-400 bg-yellow-500/10';
    };

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
                            Wallet: {formatAmount(balance)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-300">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            In Contract: {formatAmount(contractBalance)}
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
                            step="0.001"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleMaxClick}
                            className="absolute right-2 top-2 text-xs bg-dark-700 hover:bg-dark-600 px-2 py-1 rounded text-primary-400 transition-colors"
                            disabled={isLoading}
                        >
                            MAX
                        </button>
                    </div>
                </div>

                {activeTab === 'withdraw' && (
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
                        <input
                            type="text"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            placeholder={address || "0x..."}
                            className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-primary-500 outline-none font-mono text-sm"
                            disabled={isLoading}
                        />
                    </div>
                )}

                <div className="bg-dark-800 rounded-lg p-3 text-xs text-gray-400 flex justify-between">
                    <span>Gas Fee Estimate</span>
                    <span className="text-white font-mono">~0.00042 MON</span>
                </div>

                {/* Transaction Status */}
                {txStatus && (
                    <div className={"rounded-lg p-3 text-sm " + getTxStatusClass()}>
                        {txStatus.message}
                    </div>
                )}

                <button
                    onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
                    disabled={isLoading || !connected}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        activeTab === 'deposit' ? 'Deposit to Contract' : 'Withdraw from Contract'
                    )}
                </button>
            </div>
        </div>
    );
};

export default WalletManager;
