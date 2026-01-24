import { useState, useEffect, useCallback, useRef } from 'react';
import { mockEvents as fallbackEvents } from '../utils/mockData';

export const useWebSocket = () => {
    const [connected, setConnected] = useState(false);
    const [events, setEvents] = useState([]);
    const [messageHistory, setMessageHistory] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        let ws;
        try {
            ws = new WebSocket('ws://localhost:3000/ws');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to AutoFlow Backend');
                setConnected(true);
            };

            ws.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data);

                    if (payload.type === 'connected') {
                        console.log(payload.message);
                    } else if (payload.type === 'blockchain_event' || payload.type === 'task_update') {
                        setEvents(prev => [payload, ...prev].slice(0, 50));
                    }
                } catch (e) {
                    console.error('Failed to parse WS message', e);
                }
            };

            ws.onclose = () => {
                console.log('Disconnected from AutoFlow Backend');
                setConnected(false);
            };

            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                setConnected(false);
            };

        } catch (e) {
            console.error('WebSocket connection failed:', e);
            // Fallback to mock data if backend not running
            setEvents(fallbackEvents.slice(0, 10));
        }

        return () => {
            if (ws) ws.close();
        };
    }, []);

    const sendMessage = useCallback((msg) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
            setMessageHistory(prev => [...prev, { dir: 'out', msg, time: new Date() }]);
        } else {
            console.warn('WebSocket not connected');
        }
    }, []);

    const disconnect = useCallback(() => {
        if (wsRef.current) wsRef.current.close();
        setConnected(false);
    }, []);

    return { connected, events, sendMessage, disconnect };
};
