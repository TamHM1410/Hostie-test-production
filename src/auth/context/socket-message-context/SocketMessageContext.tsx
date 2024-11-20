'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import axiosClient from 'src/utils/axiosClient';

const notificationSound = typeof window !== 'undefined' ? new Audio('/assets/level-up-191997.mp3') : null;


const API_BASE_URL = 'http://34.81.244.146:5005';

interface SocketContextProps {
    messages: string[];
    totalMessage: any;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [messages, setMessages] = useState<string[]>([]);
    const [totalMessage, setTotalMessage] = useState()

    useEffect(() => {
        if (!userId) return;

        const socket: Socket = io('http://34.81.244.146:3333');

        socket.on('connect', () => {
            console.log('Socket.IO connected');
            socket.emit('subscribe', { room_id: userId });
        });

        const handleNotification = (data: any) => {
            setMessages((prevMessages:any) => [data.notification, ...prevMessages]);
            setTotalMessage((prevTotal:any) => prevTotal + 1);
            notificationSound?.play();
        };


        socket.on('seller.host_receive_transfer', handleNotification);
        socket.on('seller.receive_booking_accepted_reject', handleNotification);
        socket.on('seller.receive_hold_accepted_reject', handleNotification);
        socket.on('host.receive_seller_transfered', handleNotification);
        socket.on('host.receive_booking_request', handleNotification);
        socket.on('host.receive_hold_request', handleNotification);

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosClient.get(`${API_BASE_URL}/notification?page_size=20`);
                setMessages(response.data.data.notifications);
                setTotalMessage(response.data.data.total)
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const contextValue = useMemo(() => ({ messages, totalMessage }), [messages, totalMessage]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};
