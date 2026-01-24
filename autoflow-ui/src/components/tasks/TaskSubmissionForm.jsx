import React, { useState } from 'react';
import { Cpu, Zap, Clock, DollarSign, Database, Code, Globe, AlertCircle, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { ethers } from 'ethers';

// EscrowContract deployed on Monad Testnet
const ESCROW_CONTRACT_ADDRESS = '0x9829F1Ff048CC027424330AB6d7DE73Ed62D9F36';

// EscrowContract ABI (only the functions we need)
const ESCROW_CONTRACT_ABI = [
    'function lockEscrow(bytes32 taskHash, uint256 timeoutHours) external payable returns (uint256)',
    'event EscrowLocked(uint256 indexed escrowId, address indexed agent, uint256 amount, bytes32 taskHash)'
];

const TaskSubmissionForm = () => {
    const { connected, balance, connect, address } = useWallet();
    const [formData, setFormData] = useState({
        type: 'AI Inference',
        description: '',
        cpu: 4,
        ram: 16,
        gpu: false,
        budget: 0.01,
        priority: 'Medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [txStatus, setTxStatus] = useState(null);
    const [escrowId, setEscrowId] = useState(null);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'AI Inference': return <Cpu className="w-5 h-5" />;
            case 'Data Processing': return <Database className="w-5 h-5" />;
            case 'API Call': return <Globe className="w-5 h-5" />;
            default: return <Code className="w-5 h-5" />;
        }
    };

    const calculateEscrow = () => {
        const budget = parseFloat(formData.budget) || 0;
        return (budget * 1.1).toFixed(4);
    };

    // Generate a unique task hash from form data
    const generateTaskHash = () => {
        const taskData = JSON.stringify({
            type: formData.type,
            description: formData.description,
            cpu: formData.cpu,
            ram: formData.ram,
            gpu: formData.gpu,
            priority: formData.priority,
            timestamp: Date.now(),
            agent: address
        });
        return ethers.keccak256(ethers.toUtf8Bytes(taskData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!connected) return;

        const escrowAmount = parseFloat(calculateEscrow());
        if (escrowAmount <= 0) {
            setTxStatus({ type: 'error', message: 'Please set a valid budget' });
            return;
        }

        setIsSubmitting(true);
        setTxStatus(null);
        setEscrowId(null);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_CONTRACT_ABI, signer);

            const taskHash = generateTaskHash();
            const timeoutHours = formData.priority === 'High' ? 1 : formData.priority === 'Medium' ? 24 : 72;

            setTxStatus({ type: 'pending', message: 'Confirm transaction in MetaMask...' });

            const tx = await contract.lockEscrow(taskHash, timeoutHours, {
                value: ethers.parseEther(calculateEscrow())
            });

            setTxStatus({ type: 'pending', message: 'Transaction pending on Monad...' });

            const receipt = await tx.wait();

            // Parse the EscrowLocked event to get the escrow ID
            const escrowEvent = receipt.logs.find(log => {
                try {
                    const parsed = contract.interface.parseLog(log);
                    return parsed && parsed.name === 'EscrowLocked';
                } catch {
                    return false;
                }
            });

            if (escrowEvent) {
                const parsed = contract.interface.parseLog(escrowEvent);
                setEscrowId(parsed.args[0].toString());
            }

            setTxStatus({
                type: 'success',
                message: 'Task submitted & escrow locked!',
                txHash: receipt.hash
            });

            // Reset form after successful submission
            setFormData({ ...formData, description: '' });

        } catch (error) {
            console.error('Task submission error:', error);
            let errorMessage = 'Transaction failed';
            if (error.code === 'ACTION_REJECTED') {
                errorMessage = 'Transaction rejected by user';
            } else if (error.message) {
                errorMessage = error.message.substring(0, 100);
            }
            setTxStatus({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
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

    const getTxStatusClass = () => {
        if (!txStatus) return '';
        if (txStatus.type === 'success') return 'text-green-400 bg-green-500/10 border-green-500/30';
        if (txStatus.type === 'error') return 'text-red-400 bg-red-500/10 border-red-500/30';
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
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
                        Balance: <span className="text-white font-mono">{parseFloat(balance).toFixed(4)} MON</span>
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
                            disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            >
                                -
                            </button>
                            <span className="flex-1 text-center font-mono text-white">{formData.cpu}</span>
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, cpu: p.cpu + 1 }))}
                                className="w-8 h-8 flex items-center justify-center bg-dark-700 rounded text-white hover:bg-dark-600"
                                disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex items-center justify-between bg-dark-800 p-3 rounded-lg border border-dark-700 h-[74px]">
                        <span className="text-sm font-medium text-gray-300">GPU Required</span>
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, gpu: !p.gpu }))}
                            className={getGpuClass()}
                            disabled={isSubmitting}
                        >
                            <div className={getGpuToggleClass()} />
                        </button>
                    </div>
                </div>

                {/* Budget & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Budget (MON)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-9 p-2.5 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                            <div className="text-sm text-gray-400">Timeout</div>
                            <div className="font-medium text-white">
                                {formData.priority === 'High' ? '1 hour' : formData.priority === 'Medium' ? '24 hours' : '72 hours'}
                            </div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-dark-700 hidden md:block" />

                    <div className="text-right">
                        <div className="text-sm text-gray-400">Total Escrow Required (incl. 10% buffer)</div>
                        <div className="text-xl font-bold text-white flex items-center justify-end gap-1">
                            {calculateEscrow()} <span className="text-sm font-normal text-gray-500">MON</span>
                        </div>
                    </div>
                </div>

                {/* Transaction Status */}
                {txStatus && (
                    <div className={"rounded-lg p-4 border " + getTxStatusClass()}>
                        <div className="flex items-center gap-2">
                            {txStatus.type === 'pending' && <Loader2 size={18} className="animate-spin" />}
                            {txStatus.type === 'success' && <CheckCircle size={18} />}
                            {txStatus.type === 'error' && <AlertCircle size={18} />}
                            <span>{txStatus.message}</span>
                        </div>
                        {escrowId && (
                            <div className="mt-2 text-sm">
                                Escrow ID: <span className="font-mono">{escrowId}</span>
                            </div>
                        )}
                        {txStatus.txHash && (
                            <a
                                href={"https://testnet.monadexplorer.com/tx/" + txStatus.txHash}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-sm underline hover:text-primary-400 inline-block"
                            >
                                View on Monad Explorer →
                            </a>
                        )}
                    </div>
                )}

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
                        disabled={isSubmitting || parseFloat(balance) < parseFloat(calculateEscrow())}
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
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

                {connected && parseFloat(balance) < parseFloat(calculateEscrow()) && (
                    <div className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-500/10 p-2 rounded-lg">
                        <AlertCircle size={16} />
                        Insufficient balance. Need {calculateEscrow()} MON
                    </div>
                )}
            </form>
        </div>
    );
};

export default TaskSubmissionForm;
