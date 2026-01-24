import { useState, useEffect, useCallback } from 'react';
import { mockEvents } from '../utils/mockData';

export const useWebSocket = () => {
    const [connected, setConnected] = useState(false);
    const [events, setEvents] = useState([]);
    const [messageHistory, setMessageHistory] = useState([]);

    useEffect(() => {
        // Simulate connection
        const timer = setTimeout(() => {
            setConnected(true);
        }, 1000);

        // Initial load of mock events
        setEvents(mockEvents.slice(0, 10));

        // Simulate incoming events
        const interval = setInterval(() => {
            const newEvent = {
                ...mockEvents[Math.floor(Math.random() * mockEvents.length)],
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toISOString()
            };
            setEvents(prev => [newEvent, ...prev].slice(0, 50));
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const sendMessage = useCallback((msg) => {
        console.log('Sending message:', msg);
        setMessageHistory(prev => [...prev, { dir: 'out', msg, time: new Date() }]);
    }, []);

    const disconnect = useCallback(() => {
        setConnected(false);
    }, []);

    return { connected, events, sendMessage, disconnect };
};
