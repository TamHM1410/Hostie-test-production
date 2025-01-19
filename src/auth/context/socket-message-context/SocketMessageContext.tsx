'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import axiosClient from 'src/utils/axiosClient';
import toast from 'react-hot-toast';

const notificationSound =
  typeof window !== 'undefined' ? new Audio('/assets/level-up-191997.mp3') : null;

const API_BASE_URL = 'https://core-api.thehostie.com';

interface SocketContextProps {
  messages: string[];
  totalMessage: any;
  confirmBooking: (
    holdId: number,
    checkin: string,
    checkout: string,
    bank_id: number,
    commission: number
  ) => void;
  cancelBooking: (confirmId: number, checkin: string, checkout: string) => void;
  cancelConfirmBooking: (
    holdId: number,
    checkin: string,
    checkout: string,
    rejectionReason: string
  ) => void;
  cancelHold: (holdId: number, checkin: string, checkout: string, rejectionReason: string) => void;
  confirmReceiveMoney: (holdId: number, checkin: string, checkout: string) => void;
  confirmTransfer: (confirmId: number, checkin: string, checkout: string, commission: any) => void;
  confirmHold: (holdId: number, checkin: string, checkout: string) => void;
  fetchDataDetailBookingQR: (id: any) => void;
  fetchNotifications: () => void;

  handleBookingSubmit: (values: any) => Promise<void>;
  bankList: any;
  qr: any;
  customerList: any;
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
  const fetchNotifications = async () => {
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/notification?page_size=20`);
      setMessages(response.data.data.notifications);
      setTotalMessage(response.data.data.total);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [messages, setMessages] = useState<string[]>([]);
  const [totalMessage, setTotalMessage] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [qr, setQR] = useState();
  const [bankList, setBankList] = useState();
  const [customerList, setCustomerList] = useState<any[]>([]);
  useEffect(() => {
    if (!userId) return;

    const socket: Socket = io('https://socket.thehostie.com');

    socket.on('connect', () => {
      socket.emit('subscribe', { room_id: userId });
    });

    const handleNotification = (data: any) => {
      setMessages((prevMessages: any) => [data.notification, ...prevMessages]);
      setTotalMessage((prevTotal: any) => prevTotal + 1);
      notificationSound?.play();
    };

    socket.on('seller.host_receive_transfer', handleNotification);
    socket.on('seller.receive_booking_accepted_reject', handleNotification);
    socket.on('seller.receive_hold_accepted_reject', handleNotification);
    socket.on('host.receive_seller_transfered', handleNotification);
    socket.on('host.receive_booking_request', handleNotification);
    socket.on('host.receive_hold_request', handleNotification);
    // refunded

    socket.on('seller.host_refunded', handleNotification);
    socket.on('seller.host_not_refunded', handleNotification);

    socket.on('disconnect', () => {});

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const confirmBooking = async (
    holdId: number,
    checkin: string,
    checkout: string,
    bank_id: number,
    commission: number
  ) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${API_BASE_URL}/booking/accept`, {
        id: holdId,
        accept: true,
        checkin,
        checkout,
        commission_rate: commission,
        bank_account_id: bank_id,
      });
      toast.success('Đặt chỗ đã được xác nhận thành công.');
      fetchNotifications();
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  const cancelConfirmBooking = async (
    holdId: number,
    checkin: string,
    checkout: string,
    rejectionReason: string
  ) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${API_BASE_URL}/booking/accept`, {
        id: holdId,
        accept: false,
        checkin,
        checkout,
        commission_rate: 10,
        bank_account_id: 25,
        reason_reject: rejectionReason || 'deo thic',
      });
      toast.success('Đặt chỗ đã được hủy thành công.');
      fetchNotifications();
    } catch (error) {
      toast.error('Hủy thất bại, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  const confirmReceiveMoney = async (holdId: number, checkin: string, checkout: string) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${API_BASE_URL}/booking/receive`, {
        id: holdId,
        is_received: true,
        checkin,
        checkout,
      });
      toast.success('Xác nhận đã nhận tiền thành công');
      fetchNotifications();
    } catch (error) {
      console.error('Error canceling hold:', error);
      toast.error('Xác nhận đã nhận tiền thất bại, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  const confirmHold = async (holdId: number, checkin: string, checkout: string) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${API_BASE_URL}/booking/hold/accept`, {
        hold_id: holdId,
        accept: true,
        checkin,
        checkout,
      });
      toast.success('Đã xác nhận thành công');
      fetchNotifications();
    } catch (error) {
      const msg = error?.response?.data?.msg;
      if (msg === 'another hold for residence_id 115 is already accepted') {
        toast.error('Có thể đã có ngày trong đây đã được dữ ');
        return;
      }
      toast.error('Có thể đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };
  const cancelHold = async (
    holdId: number,
    checkin: string,
    checkout: string,
    rejectionReason: string
  ) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${API_BASE_URL}/booking/hold/accept`, {
        hold_id: holdId,
        accept: false,
        checkin,
        reason_reject: rejectionReason,
        checkout,
      });
      toast.success('Hủy đặt chỗ thành công');
      fetchNotifications();
    } catch (error) {
      toast.error('Hủy đặt chỗ thất bại');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDataDetailBookingQR = async (id: any) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/booking/${id}/qr`, {});
      setQR(response.data.data);
    } catch (error) {
      console.error('Error fetching booking data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const confirmTransfer = async (
    confirmId: number,
    checkin: string,
    checkout: string,
    commission: any
  ) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${API_BASE_URL}/booking/transfer`, {
        id: confirmId,
        checkin,
        checkout,
        commission_rate: commission,
      });
      toast.success('Đã xác nhận thành công');
      fetchNotifications();
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  const cancelBooking = async (confirmId: number, checkin: string, checkout: string) => {
    try {
      setIsLoading(true);
      await axiosClient.post(`${API_BASE_URL}/booking/cancel`, {
        id: confirmId,
        checkin,
        checkout,
      });
      toast.success('Hủy đặt nơi lưu trú thành công');
      fetchNotifications();
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    const fetchListCustomer = async () => {
      setIsLoading(true);

      try {
        const response = await axiosClient.get(`${API_BASE_URL}/customers?page_size=99999`, {});
        if (!response) {
          throw new Error('Unable to fetch customer list');
        }

        setCustomerList(response.data.data);
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    const fetchDataBankAccount = async () => {
      setIsLoading(true);
      try {
        const response = await axiosClient.get(
          `https://api.thehostie.com/v1/api/users/bank-accounts`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );
        setBankList(response);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchListCustomer();
    fetchNotifications();
    fetchDataBankAccount();
  }, []);

  const contextValue = useMemo(
    () => ({
      customerList,
      bankList,
      fetchNotifications,
      handleBookingSubmit,
      confirmBooking,
      cancelBooking,
      cancelConfirmBooking,
      cancelHold,
      confirmReceiveMoney,
      confirmTransfer,
      confirmHold,
      fetchDataDetailBookingQR,
     
      qr,
      messages,
      totalMessage,
    }),
    [messages, bankList, totalMessage, qr]
  );

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};
