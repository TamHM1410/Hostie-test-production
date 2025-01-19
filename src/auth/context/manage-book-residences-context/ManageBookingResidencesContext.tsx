/* eslint-disable react-hooks/exhaustive-deps */
// src/contexts/BookingContext.tsx

'use client';

import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';

// Define types for the booking data
interface Booking {
  id: number;
  residence_id: number; // Add residence_id field
  seller_id: number; // Add seller_id field
  total_amount: number; // Add total_amount field
  paid_amount: number; // Add paid_amount field
  checkin: string;
  checkout: string;
  guest_name: string | null; // Can be null
  guest_phone: string | null; // Can be null
  is_host_accept: boolean;
  is_seller_transfer: boolean;
  is_host_receive: boolean;
  status: number;
}

const baseURl = `https://core-api.thehostie.com`;
// Define the context state type
interface BookingContextType {
  rows: Booking[];
  totalRecords: number;
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  confirmBooking: (
    holdId: number,
    checkin: string,
    checkout: string,
    bank_id: number,
    commission: number
  ) => Promise<void>;
  cancelBooking: (
    holdId: number,
    checkin: string,
    checkout: string,
    rejectionReason: string
  ) => Promise<void>;
  confirmReceiveMoney: (holdId: number, checkin: string, checkout: string) => Promise<void>;
  fetchBookingLogs: (id: any) => void;
  confirmNotReceiveMoney: (holdId: number, checkin: string, checkout: string) => Promise<void>;
  logs: any;
  bankList: any;
  fetchPriceQuotation: (checkin: string, checkout: string, id: number, booking_id?: any) => void;
  priceQuotation: any;
}

// Create the context with a default value
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Custom hook to use the booking context
export const useManageBookingResidencesContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error(
      'useManageBookingResidencesContext must be used within a ManageBookingResidencesProvider'
    );
  }
  return context; // Added return statement
};

// Define the props for the provider
interface BookingProviderProps {
  children: ReactNode;
}

// Provider component
export const ManageBookingResidencesProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [rows, setRows] = useState<Booking[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [bankList, setBankList] = useState();
  const ROWS_PER_PAGE = 9999;
  const { data: session } = useSession();
  const [logs, setLogs] = useState();

  const [priceQuotation, setPriceQuotation] = useState();
  // Function to fetch booking data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`${baseURl}/booking/host`, {
        params: { page, page_size: ROWS_PER_PAGE, id: 'asc' },
      });
      setRows(response.data?.result);

      setTotalRecords(response.data.pagination.total_pages); // Consider using total_records if that's the correct field
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải dữ liệu đặt chỗ.');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDataBankAccount = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.thehostie.com/v1/api/users/bank-accounts`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      setBankList(response.data.result);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBookingLogs = async (id: any) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`${baseURl}/booking/${id}/logs`, {});
      setLogs(response?.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  // Function Confirm booking
  const confirmBooking = async (
    holdId: number,
    checkin: string,
    checkout: string,
    bank_id: number,
    commission: number
  ) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${baseURl}/booking/accept`, {
        id: holdId,
        accept: true,
        checkin,
        checkout,
        commission_rate: commission,
        bank_account_id: bank_id,
      });
      toast.success('Đặt chỗ đã được xác nhận thành công.');
      fetchData();
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  // Function Confirm reject booking
  const cancelBooking = async (
    holdId: number,
    checkin: string,
    checkout: string,
    rejectionReason: string
  ) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${baseURl}/booking/accept`, {
        id: holdId,
        accept: false,
        checkin,
        checkout,
        commission_rate: 10,
        bank_account_id: 25,
        reason_reject: rejectionReason || 'deo thic',
      });
      toast.success('Đặt chỗ đã được hủy thành công.');

      fetchData();
    } catch (error) {
      toast.error('Hủy thất bại, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  // Function receive money
  const confirmReceiveMoney = async (holdId: number, checkin: string, checkout: string) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${baseURl}/booking/receive`, {
        id: holdId,
        is_received: true,
        checkin,
        checkout,
      });
      toast.success('Xác nhận đã nhận tiền thành công');

      fetchData();
    } catch (error) {
      console.error('Error canceling hold:', error);
      toast.error('Xác nhận đã nhận tiền thất bại, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  const confirmNotReceiveMoney = async (holdId: number, checkin: string, checkout: string) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${baseURl}/booking/receive`, {
        id: holdId,
        is_received: false,
        checkin,
        checkout,
      });
      toast.success('Xác nhận chưa nhận tiền thành công');

      fetchData();
    } catch (error) {
      console.error('Error canceling hold:', error);
      toast.error('Xác nhận chưa nhận tiền thất bại, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPriceQuotation = async (
    checkin: string,
    checkout: string,
    id: number,
    booking_id?: any
  ) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post(`${baseURl}/booking/price_quotation`, {
        residence_ids: [parseInt(id)],
        checkin,
        checkout,
        for_host: true,
        booking_id,
      });

      const newData = response.data?.find((d: any) => d.residence_id === id);
      setPriceQuotation(newData?.commission_rate);
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when page changes
  useEffect(() => {
    fetchData();
    fetchDataBankAccount();
  }, [page]);

  // Memoize the context value
  const value = useMemo(
    () => ({
      rows,
      totalRecords,
      page,
      setPage,
      isLoading,
      cancelBooking,
      confirmBooking,
      confirmReceiveMoney,
      bankList,
      fetchBookingLogs,
      logs,
      confirmNotReceiveMoney,
      priceQuotation,
      fetchPriceQuotation,
    }),
    [rows, totalRecords, page, isLoading, bankList, logs, priceQuotation]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
