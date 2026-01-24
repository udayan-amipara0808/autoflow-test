import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState(0);
    const [network, setNetwork] = useState('monad-testnet');
    const [isConnecting, setIsConnecting] = useState(false);

    const connect = async () => {
        setIsConnecting(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setConnected(true);
        setAddress('0x7f3a8b2c9d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7');
        setBalance(1234.56);
        setIsConnecting(false);
        return true;
    };

    const disconnect = () => {
        setConnected(false);
        setAddress(null);
        setBalance(0);
    };

    const switchNetwork = async () => {
        setNetwork('monad-mainnet');
    };

    const value = {
        connected,
        address,
        balance,
        network,
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
