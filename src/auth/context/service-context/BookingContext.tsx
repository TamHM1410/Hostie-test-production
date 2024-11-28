/* eslint-disable radix */
/* eslint-disable arrow-body-style */

'use client';


import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import axiosClient from 'src/utils/axiosClient';

interface CalendarFilterParams {
    type: number;
    checkin: string;
    checkout: string;
    province_id: number;
    page: any;
}
interface CalendarFilterResponse {
    data: any; // Replace `any` with the actual API response structure
}
const API_BASE_URL = 'https://core-api.thehostie.com';
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
    fetchBookingData: (page: number,
        year: string,
        month: string,
        selectedProvince: string | null,
        selectedAccommodationType: string | null,
        dateRange: [Date | null, Date | null],
        maxPrice: number | null, minPrice: number | null) => void;
    priceQuotation: any;
    fetchPriceQuotation: (checkin: string, checkout: string, id: number, guest_count?: any) => void;
    handleHoldingSubmit: (residence_id: string, startDate: string, endDate: string, expireTime: number) => Promise<void>;
    handleBookingSubmit: (values: any) => Promise<void>;
    fetchCalendarFilter: (params: CalendarFilterParams) => Promise<void>;
    fetchProvince: () => void;
    provinceList: any;
    fetchPolicy: (id: any) => void;
    policy: any;

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
    const [priceQuotation, setPriceQuotation] = useState()
    const [policy, setPolicy] = useState()

    const fetchPolicy = async (id: any) => {
        setLoading(true)
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/residences/${id}/policy`, {});

            if (response.status === 200) {
                const data1 = response.data;
                setPolicy(data1.data);
                setLoading(false)
            } else {
                console.error('Failed to fetch residence data');
            }
        } catch (error) {
            console.error('Error fetching residence data:', error);
        }
        finally {
            setLoading(false)
        }
    };
    const fetchResidenceInfor = async (id: any) => {
        setLoading(true)
        try {
            const response = await axiosClient.get(`${API_BASE_URL}/residences/${id}`, {});

            if (response.status === 200) {
                const data1 = response.data;
                setResidenceInfor(data1.data);
                setLoading(false)
            } else {
                console.error('Failed to fetch residence data');
            }
        } catch (error) {
            console.error('Error fetching residence data:', error);
        }
        finally {
            setLoading(false)
        }
    };

    const fetchBookingData = async (
        page: number,
        year: string,
        month: string,
        selectedProvince: string | null,
        selectedAccommodationType: string | null,
        dateRange: [Date | null, Date | null],
        maxPrice: number | null,
        minPrice: number | null
    ) => {
        setLoading(true);
        setError(null);
        const formatDate = (date: Date | null): string => {
            if (!date) return '';

            // Use Intl.DateTimeFormat with the Vietnam time zone (UTC+7)
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'Asia/Ho_Chi_Minh' // Vietnam Time Zone (UTC+7)
            };

            const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

            // Replace '/' with '-' to match the desired format (dd-mm-yyyy)
            return formattedDate.replace(/\//g, '-');
        };

        const formattedCheckinDate = dateRange?.[0] ? formatDate(new Date(dateRange[0])) : '';
        const formattedCheckoutDate = dateRange?.[1] ? formatDate(new Date(dateRange[1])) : '';

        const formattedMonth = month.length === 1 ? `0${month}` : month;
        // Initialize the base query string
        let apiQuery = `?page_size=${pageSize}&page=${page}&month=${year}-${formattedMonth}`;

        // Add parameters to the query only if they are not null or undefined
        if (formattedCheckinDate) {
            apiQuery += `&checkin=${formattedCheckinDate}`;
        }
        if (formattedCheckoutDate) {
            apiQuery += `&checkout=${formattedCheckoutDate}`;
        }
        if (selectedAccommodationType) {
            apiQuery += `&type=${selectedAccommodationType}`;
        }
        if (selectedProvince) {
            apiQuery += `&province_id=${selectedProvince}`;
        }
        if (maxPrice !== undefined && maxPrice !== null) {
            apiQuery += `&max_price=${maxPrice}`;
        }
        if (minPrice !== undefined && minPrice !== null) {
            apiQuery += `&min_price=${minPrice}`;
        }
        try {
            const response = await axiosClient.get(
                `${API_BASE_URL}/residences/calendar${apiQuery}`
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


    const [provinceList, setProviceList] = useState()

    const fetchProvince = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosClient.get(`${API_BASE_URL}/region/provinces`, {});
            if (!response) {
                throw new Error('Unable to fetch customer list');
            }
            setProviceList(response.data.data);
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
    const fetchPriceQuotation = async (checkin: string, checkout: string, id: number, guest_count?: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosClient.post(
                `${API_BASE_URL}/booking/price_quotation`,
                {
                    for_host: true,
                    residence_ids: [parseInt(id)],
                    checkin,
                    checkout,
                    guest_count
                }
            );

            if (response.status !== 200) {
                throw new Error('Unable to fetch price quotation');
            }
            const newData = response.data?.data?.find((d: any) => d.residence_id === id)
            setPriceQuotation(newData);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'An error occurred while fetching the price quotation.');
        } finally {
            setLoading(false);
        }
    };
    const fetchCalendarFilter = async (params: CalendarFilterParams): Promise<void> => {
        setLoading(true);
        try {
            const response = await axiosClient.get<CalendarFilterResponse>(
                `http://{{DeployURL}}:5005/residences/calendar?page_size=${pageSize}&page=${1}`,
                { params }
            );
            const data = response;
            setBookingData(data.data.data.calendars);
            setTotalPages(data.data.data.total_pages);
        } catch (error) {
            console.error("Error fetching calendar filter:", error);
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

        const socket: Socket = io('https://socket.thehostie.com');

        socket.on('connect', () => {

            socket.emit('subscribe', { room_id: userId });
        });

        socket.on('common.receive_change_calendar', (data) => {
            appendCalendarData(data.calendar)
        });

        socket.on('disconnect', () => {

        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });
        return () => {
            socket.disconnect();
        };
    })

    useEffect(() => {
        fetchProvince()
    }, [])


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
            priceQuotation,
            fetchPriceQuotation,
            fetchCalendarFilter,
            fetchProvince,
            provinceList,
            fetchPolicy, policy


        }),
        [bookingData, totalPages, currentPage, loading, errorr, customerList, residenceInfor, priceQuotation, provinceList, policy]
    );

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
