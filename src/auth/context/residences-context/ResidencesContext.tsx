'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import axiosClient from 'src/utils/axiosClient';
import goAxiosClient from 'src/utils/goAxiosClient';

interface ServiceContextType {
    serviceData: any[];
    totalPage: number;
    isLoading: boolean;
    fetchData: (page: number, searchTerm: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [serviceData, setServiceData] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (page: number, searchTerm: string) => {
        setIsLoading(true);
        try {
            const response = await  goAxiosClient.get(`https://core-api.thehostie.com/residences/`, {
                params: {
                    page,
                    q: searchTerm,
                    page_size: 6
                }
            });
            setServiceData(response?.data?.residences);
            setTotalPage(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const value = useMemo(
        () => ({
            serviceData,
            totalPage,
            isLoading,
            fetchData,
        }),
        [serviceData, totalPage, isLoading]
    );

    return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error('useServiceContext must be used within a ServiceProvider');
    }
    return context;
};
