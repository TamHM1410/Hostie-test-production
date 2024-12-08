/* eslint-disable react-hooks/exhaustive-deps */

'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';

interface HoldListContextProps {
    rows: any[];
    totalRecords: number;
    page: number;
    setPage: (page: number) => void;
    isLoading: boolean;
    fetchDataDetail: any;
    fetchData: () => void;
    detail: any
    cancelHold: (holdId: number, checkin: string, checkout: string) => Promise<void>;
}

const HoldListContext = createContext<HoldListContextProps | undefined>(undefined);

const ROWS_PER_PAGE = 1000000;

const baseUrl = 'https://core-api.thehostie.com'


export const HoldListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rows, setRows] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [detail, setDetail] = useState();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`${baseUrl}/booking/hold`, {
                params: { page, page_size: ROWS_PER_PAGE },

            });
            setRows(response.data.data.result);
            setTotalRecords(response.data.data.pagination.total_pages);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchDataDetail = async (id: any) => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`${baseUrl}/booking/hold/${id}`, {});
            setDetail(response.data.data);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const cancelHold = async (holdId: number, checkin: string, checkout: string) => {
        try {
            setIsLoading(true)
            await axiosClient.post(`${baseUrl}/booking/hold/cancel`, {
                id: holdId,
                checkin,
                checkout,
            });
            toast.success('Hủy dữ chỗ thành công');

            fetchData();
            setIsLoading(false)
        } catch (error) {
            toast.error('Hủy dữ chỗ thất bại');
        }
        finally {
            setIsLoading(false);
        }
    };

    const value = useMemo(
        () => ({ rows, totalRecords, page, setPage, isLoading, detail, fetchDataDetail, cancelHold, fetchData }),
        [rows, totalRecords, page, isLoading, detail]
    );

    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <HoldListContext.Provider value={value}>
            {children}
        </HoldListContext.Provider>
    );
};

export const useHoldListContext = (): HoldListContextProps => {
    const context = useContext(HoldListContext);
    if (!context) {
        throw new Error('useHoldListContext must be used within a HoldListProvider');
    }
    return context;
};
