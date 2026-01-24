import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext(null);

const MONAD_CHAIN_ID = '0x279f'; // 10143 in hex
const MONAD_CONFIG = {
    chainId: MONAD_CHAIN_ID,
    chainName: 'Monad Testnet',
    nativeCurrency: {
        name: 'Monad',
        symbol: 'MON',
        decimals: 18,
    },
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    blockExplorerUrls: ['https://testnet.monadexplorer.com'],
};

export const WalletProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState(0);
    const [chainId, setChainId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        // Check if wallet is already connected
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);

            window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
                if (accounts.length > 0) {
                    handleAccountsChanged(accounts);
                    provider.getNetwork().then(network => {
                        setChainId("0x" + Number(network.chainId).toString(16));
                        // Update balance
                        provider.getBalance(accounts[0]).then(bal => {
                            setBalance(ethers.formatEther(bal));
                        });
                    });
                }
            });

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
    }, []);

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            disconnect();
        } else {
            setAddress(accounts[0]);
            setConnected(true);
            // Refresh balance
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const bal = await provider.getBalance(accounts[0]);
                setBalance(ethers.formatEther(bal));
            }
        }
    };

    const handleChainChanged = (newChainId) => {
        setChainId(newChainId);
        window.location.reload();
    };

    const connect = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return false;
        }

        setIsConnecting(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = await provider.getSigner();
            const addr = await signer.getAddress();
            const net = await provider.getNetwork();

            setAddress(addr);
            setChainId("0x" + Number(net.chainId).toString(16));
            setConnected(true);

            const bal = await provider.getBalance(addr);
            setBalance(ethers.formatEther(bal));

            // Auto-switch to Monad if wrong network
            if ("0x" + Number(net.chainId).toString(16) !== MONAD_CHAIN_ID) {
                await switchNetwork();
            }

            return true;
        } catch (error) {
            console.error("Connection error:", error);
            return false;
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        setConnected(false);
        setAddress(null);
        setBalance(0);
    };

    const switchNetwork = async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: MONAD_CHAIN_ID }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [MONAD_CONFIG],
                    });
                } catch (addError) {
                    console.error("Failed to add Monad network", addError);
                }
            } else {
                console.error("Failed to switch network", switchError);
            }
        }
    };

    // Mock implementation match for backend demo
    const value = {
        connected,
        address,
        balance,
        network: chainId === MONAD_CHAIN_ID ? 'Monad Testnet' : 'Unknown',
        isConnecting,
        connect,
        disconnect,
        switchNetwork
    };

    return React.createElement(WalletContext.Provider, { value: value }, children);
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
