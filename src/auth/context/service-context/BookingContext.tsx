/* eslint-disable arrow-body-style */

'use client';

import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import axiosClient from 'src/utils/axiosClient';

const API_BASE_URL = 'http://34.81.244.146:5005';
interface BookingContextProps {
    bookingData: any[];
    fetchListCustomer: () => void;
    customerList: any[];
    totalPages: number;
    currentPage: number;
    loading: boolean;
    errorr: string | null;
    residenceInfor: any;
    fetchResidenceInfor: any;
    setCurrentPage: (page: number) => void;
    fetchBookingData: (month: number, year: number, page: number) => void;
    handleHoldingSubmit: (residence_id: string, startDate: string, endDate: string, expireTime: number) => Promise<void>;
    handleBookingSubmit: (values: any) => Promise<void>;

}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);
export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookingData, setBookingData] = useState<any[]>([]);
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [errorr, setError] = useState<string | null>(null);
    const [residenceInfor, setResidenceInfor] = useState()
    const pageSize = 7;
    const { data: session } = useSession();
    const userId = session?.user?.id;



    const fetchResidenceInfor = async (id: any) => {
        try {
            const response = await axiosClient.get(`http://34.81.244.146:5005/residences/${id}`, {});

            if (response.status === 200) {
                const data1 = response.data;
                console.log(data1.data);
                setResidenceInfor(data1.data);
            } else {
                console.error('Failed to fetch residence data');
            }
        } catch (error) {
            console.error('Error fetching residence data:', error);
        }
    };



    const fetchBookingData = async (month: number, year: number, page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosClient.get(
                `${API_BASE_URL}/residences/calendar?page_size=${pageSize}&page=${page}&month=2024-${month < 10 ? `0${month}` : month
                }`,
                {}
            );
            if (!response) {
                throw new Error('Unable to fetch booking data');
            }
            const data = response;
            setBookingData(data.data.data.calendars);
            setTotalPages(data.data.data.total_pages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchListCustomer = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosClient.get(`${API_BASE_URL}/customers?page_size=99999`, {});
            if (!response) {
                throw new Error('Unable to fetch customer list');
            }

            setCustomerList(response.data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleHoldingSubmit = async (residence_id: string, startDate: string, endDate: string, expireTime: number) => {
        const requestBody = {
            residence_id,
            checkin: startDate,
            checkout: endDate,
            expire: expireTime
        };

        try {
            const response = await axiosClient.post(`${API_BASE_URL}/booking/hold`, requestBody, {});

            if (response.status === 200) {
                toast.success('Giữ chỗ thành công');
            } else {
                toast.error('Giữ chỗ thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            if (
                error.response?.data?.msg ===
                'another hold with residence_id 153 has already been accepted during this period'
            ) {
                console.log(error.response);

                toast.error('Ngày được chọn có thể đã được giữ vui lòng thử lại');
            } else {
                toast.error('Có vẻ đã có lỗi xảy ra.');
            }
        }
    };
    const handleBookingSubmit = async (values: any) => {
        if (values.hold_id) {
            const payload = {
                hold_residence_id: values.hold_id,
                paid_amount: values.paid_amount,
                residence_id: values.residence_id || '',
                checkin: values.start_date,
                checkout: values.end_date,
                guest_id: values.guest_id,
                guest_count: values.guest_count,
                note: values.note,
            };

            try {
                const response = await axiosClient.post(`${API_BASE_URL}/booking/`, payload, {});
                if (response.status === 200) {
                    toast.success('Tạo đơn đặt nơi lưu trú thành công');
                } else {
                    toast.error('Giữ chỗ thất bại. Vui lòng thử lại.');
                }

                // Additional logic can be added here if needed
            } catch (error) {
                console.error('Error:', error);
                toast.error('Đã xảy ra lỗi trong quá trình tạo đơn đặt nơi lưu trú.');
            }
        } else {
            const payload = {

                paid_amount: values.paid_amount,
                residence_id: values.residence_id || '',
                checkin: values.start_date,
                checkout: values.end_date,
                guest_id: values.guest_id,
                guest_count: values.guest_count,
                note: values.note,
            };

            try {
                const response = await axiosClient.post(`${API_BASE_URL}/booking/`, payload, {});
                if (response.status === 200) {
                    toast.success('Tạo đơn đặt nơi lưu trú thành công');
                } else {
                    toast.error('Giữ chỗ thất bại. Vui lòng thử lại.');
                }

                // Additional logic can be added here if needed
            } catch (error) {
                console.error('Error:', error);
                toast.error('Đã xảy ra lỗi trong quá trình tạo đơn đặt nơi lưu trú.');
            }
        }


    };
    const appendCalendarData = (incomingCalendarData: any[]) => {
        setBookingData((prevBookingData) => {
            // Loop through each incoming data item
            return prevBookingData.map((residence) => {
                const matchedCalendarData = incomingCalendarData.filter((item) => item.residence_id === residence.id);
                // If there's a match, replace or update relevant dates in the residence's calendar
                if (matchedCalendarData.length > 0) {
                    const updatedCalendar = residence.calendar.map((existingEntry: any) => {
                        const incomingEntry = matchedCalendarData.find((item) => item.date === existingEntry.date);
                        // Merge existing entry with incoming entry if date matches
                        return incomingEntry ? { ...existingEntry, ...incomingEntry } : existingEntry;
                    });
                    // Add any new dates from incoming data not already present in the calendar
                    matchedCalendarData.forEach((item) => {
                        if (!updatedCalendar.some((entry: any) => entry.date === item.date)) {
                            updatedCalendar.push(item);
                        }
                    });
                    return { ...residence, calendar: updatedCalendar };
                }
                return residence;
            });
        });
    }
    useEffect(() => {
        if (!userId) return;

        const socket: Socket = io('http://34.81.244.146:3333');

        socket.on('connect', () => {
            console.log('Socket.IO connected');
            socket.emit('subscribe', { room_id: userId });
        });

        socket.on('common.receive_change_calendar', (data) => {
            appendCalendarData(data.calendar)
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });
        return () => {
            socket.disconnect();
        };
    })

    const value = useMemo(
        () => ({
            bookingData,
            totalPages,
            currentPage,
            loading,
            errorr,
            setCurrentPage,
            fetchBookingData,
            handleHoldingSubmit,
            handleBookingSubmit,
            fetchListCustomer,
            fetchResidenceInfor,
            residenceInfor,
            customerList,

        }),
        [bookingData, totalPages, currentPage, loading, errorr, customerList, residenceInfor]
    );

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
