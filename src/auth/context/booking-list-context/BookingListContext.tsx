/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';
import { useQuery ,useQueryClient} from '@tanstack/react-query';

const BookingListContext = createContext<BookingListContextProps | undefined>(undefined);

interface BookingListContextProps {
    rows: any[];
    setRows: React.Dispatch<React.SetStateAction<any>>;
    totalRecords: number;
    isLoading: boolean;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    detail: any;
    fetchDataDetail: any;
    fetchDataDetailBookingQR: any;
    confirmTransfer: any;
    cancelBooking: any;
    handleUpdateBookingSubmit: (values: any) => Promise<void>
    qr: any;
    fetchBookingLogs: (id: any) => void;
    logs: any;
}

const ROWS_PER_PAGE = 9999;

const baseURl = `https://core-api.thehostie.com`;


export const BookingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const queryClient=useQueryClient()

  
    const [rows, setRows] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [detail, setDetail] = useState();
    const [qr, setQR] = useState()
    const [logs, setLogs] = useState()



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axiosClient.get(`${baseURl}/booking?sort=id:desc`, {
                    params: { page, page_size: ROWS_PER_PAGE, },
                });
                setRows(response.data?.data?.result);
                setTotalRecords(response.data?.data?.pagination.total_pages);
            } catch (error) {
                console.error('Error fetching booking data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        queryClient.invalidateQueries(["booking"]as any)
    }, [page]);

    const fetchBookingLogs = async (id: any) => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(
                `${baseURl}/booking/${id}/logs`, {
            }
            );

            setLogs(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDataDetail = async (id: any) => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`${baseURl}/booking/${id}`, {});
            setDetail(response.data?.data);
        } catch (error) {
            console.error('Error fetching booking data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDataDetailBookingQR = async (id: any) => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`${baseURl}/booking/${id}/qr`, {});
            setQR(response.data.data);
            console.log(response.data.data);

        } catch (error) {
            console.error('Error fetching booking data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmTransfer = async (confirmId: number, checkin: string, checkout: string, commission: any) => {
        try {
            setIsLoading(true)
            await axiosClient.post(`${baseURl}/booking/transfer`, { id: confirmId, checkin, checkout, commission_rate: commission });
            toast.success('Đã xác nhận thành công');
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const response = await axiosClient.get(`${baseURl}/booking`, {
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
            fetchData();
        } catch (error) {
            toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
        }
        finally {
            setIsLoading(false);
        }
    };

    const cancelBooking = async (confirmId: number, checkin: string, checkout: string) => {
        try {
            setIsLoading(true)
            await axiosClient.post(`${baseURl}/booking/cancel`, { id: confirmId, checkin, checkout });
            toast.success('Hủy đặt nơi lưu trú thành công');
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const response = await axiosClient.get(`${baseURl}/booking`, {
                        params: { page, page_size: ROWS_PER_PAGE },
                    });
                    setRows(response.data.result);
                    setTotalRecords(response.data.pagination.total_pages);
                } catch (error) {
                    console.error('Error fetching booking data:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } catch (error) {
            toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateBookingSubmit = async (values: any) => {
        const payload = {
            id: values.id,
            paid_amount: values.paid_amount,
            residence_id: values.residence_id || '',
            checkin: values.checkin,
            checkout: values.checkout,
            guest_id: values.guest_id,
            guest_count: values.guest_count,
            note: values.description,

        }

        try {
            setIsLoading(true)
            const response = await axiosClient.put(`${baseURl}/booking/`, payload, {});
            if (response.status === 200) {
                toast.success('Cập nhật thông tin đặt nơi lưu trú thành công');
            } else {
                toast.error('Cập nhật thông tin đặt nơi lưu trú thất bại. Vui lòng thử lại.');
            }

            // Additional logic can be added here if needed
        } catch (error) {
            console.error('Error:', error);
            toast.error('Đã xảy ra lỗi trong quá trình cập nhật thông tin đặt nơi lưu trú.');
        } finally {
            setIsLoading(false)
        }
    };

    // Wrap the value in useMemo to prevent unnecessary re-renders
    const providerValue = useMemo(
        () => ({
            rows,
            setRows,
            totalRecords,
            isLoading,
            page,
            setPage,
            detail,
            fetchDataDetail,
            confirmTransfer,
            cancelBooking,
            handleUpdateBookingSubmit,
            fetchDataDetailBookingQR,
            qr,
            fetchBookingLogs,
            logs
        }),
        [rows, totalRecords, isLoading, page, setPage, detail, qr, logs]
    );

    return (
        <BookingListContext.Provider value={providerValue}>{children}</BookingListContext.Provider>
    );
};

export const useBookingListContext = () => {
    const context = useContext(BookingListContext);
    if (context === undefined) {
        throw new Error('useBookingListContext must be used within a BookingListProvider');
    }
    return context;
};
