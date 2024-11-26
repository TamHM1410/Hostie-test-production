/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';

const ROWS_PER_PAGE = 9999;

const baseUrl = 'https://core-api.thehostie.com';
type RowData = {
    id: number;
    residence_name: string;
    seller_name: string;
    checkin: string;
    checkout: string;
    is_host_accept: boolean;
    status: number;
};

type ManageHoldResidencesContextType = {
    rows: RowData[];
    totalRecords: number;
    page: number;
    setPage: (value: number) => void;
    isLoading: boolean;
    confirmHold: (holdId: number, checkin: string, checkout: string) => Promise<void>;
    cancelHold: (holdId: number, checkin: string, checkout: string, rejectionReason: string) => Promise<void>;
    // fetchData: () => Promise<void>;
};

const ManageHoldResidencesContext = createContext<ManageHoldResidencesContextType | undefined>(
    undefined
);

export const ManageHoldResidencesProvider = ({ children }: { children: ReactNode }) => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axiosClient.get(
                    `${baseUrl}/booking/hold/host?page=${page}&page_size=${ROWS_PER_PAGE}`,
                    {}
                );
                setRows(response.data.data.result);
                setTotalRecords(response.data.data.pagination.total_pages);
            } catch (error) {
                toast.error('Lỗi khi lấy dữ liệu đặt chỗ');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [page]);

    const confirmHold = async (holdId: number, checkin: string, checkout: string) => {
        try {
            setIsLoading(true)
            await axiosClient.post(`${baseUrl}/booking/hold/accept`, {
                hold_id: holdId,
                accept: true,
                checkin,
                checkout,

            });
            toast.success('Đã xác nhận thành công');
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const response = await axiosClient.get(
                        `${baseUrl}/booking/hold/host?page=${page}&page_size=${ROWS_PER_PAGE}`,
                        {}
                    );
                    setRows(response.data.data.result);
                    setTotalRecords(response.data.data.pagination.total_pages);
                } catch (error) {
                    toast.error('Lỗi khi lấy dữ liệu đặt chỗ');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } catch (error) {
            const msg = error?.response?.data?.msg;
            if (msg === 'another hold for residence_id 115 is already accepted') {
                toast.error('Có thể đã có ngày trong đây đã được dữ ');
                return;
            }
            toast.error('Có thể đã có lỗi xảy ra');
        } finally {
            setIsLoading(false)
        }
    };

    const cancelHold = async (holdId: number, checkin: string, checkout: string, rejectionReason: string) => {
        try {
            setIsLoading(true)
            await axiosClient.post(`${baseUrl}/booking/hold/accept`, {
                hold_id: holdId,
                accept: false,
                checkin,
                reason_reject: rejectionReason,
                checkout,

            });
            toast.success('Hủy đặt chỗ thành công');
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const response = await axiosClient.get(
                        `${baseUrl}/booking/hold/host?page=${page}&page_size=${ROWS_PER_PAGE}`,
                        {}
                    );
                    setRows(response.data.data.result);
                    setTotalRecords(response.data.data.pagination.total_pages);
                } catch (error) {
                    toast.error('Lỗi khi lấy dữ liệu đặt chỗ');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } catch (error) {
            toast.error('Hủy đặt chỗ thất bại');
        } finally {
            setIsLoading(false)
        }
    };

    const contextValue = useMemo(
        () => ({ rows, totalRecords, page, setPage, isLoading, confirmHold, cancelHold }),
        [rows, totalRecords, page, isLoading]
    );

    return (
        <ManageHoldResidencesContext.Provider value={contextValue}>
            {children}
        </ManageHoldResidencesContext.Provider>
    );
};

export const useManageHoldResidencesContext = () => {
    const context = useContext(ManageHoldResidencesContext);
    if (!context) {
        throw new Error(
            'useManageHoldResidencesContext must be used within a ManageHoldResidencesProvider'
        );
    }
    return context;
};
