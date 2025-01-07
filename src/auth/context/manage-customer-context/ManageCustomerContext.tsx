/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';

const baseUrl = 'https://core-api.thehostie.com';

type CustomerData = {
    id: number;
    name: string;
    phone: string;
    user_id: number;
    status: number;
    updated_at: string;
    created_at: string;
};

type UpdateCustomerParams = {
    id: number;
    name: string;
    phone: string;
    status: number;
};

type CreateCustomerParams = {
    name: string;
    phone: string;
    status: number;
};

type ManageCustomerContextType = {
    customers: CustomerData[];
    isLoading: boolean;
    refreshCustomers: () => void;
    updateCustomer: (id: any, params: UpdateCustomerParams) => Promise<void>;
    deleteCustomer: (id: number) => Promise<void>;
    createCustomer: (params: CreateCustomerParams) => Promise<void>; // New function type for creating a customer
};

const ManageCustomerContext = createContext<ManageCustomerContextType | undefined>(undefined);

export const ManageCustomerProvider = ({ children }: { children: ReactNode }) => {
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch customers from the API
    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`${baseUrl}/customers`);
            setCustomers(response.data.data);
        } catch (error) {
            toast.error('Lỗi khi lấy dữ liệu khách hàng');
        } finally {
            setIsLoading(false);
        }
    };

    // Update customer details
    const updateCustomer = async (id: number, params: UpdateCustomerParams) => {
        try {
            await axiosClient.put(`${baseUrl}/customers/${id}`, {
                name: params.name,
                phone: params.phone,
                status: 2,
            });
            toast.success('Cập nhật thông tin khách hàng thành công');
            fetchCustomers(); // Refresh customer list after update
        } catch (error) {
            toast.error('Lỗi khi cập nhật thông tin khách hàng');
        }
    };

    // Delete customer
    const deleteCustomer = async (id: number) => {
        try {
            await axiosClient.delete(`${baseUrl}/customers/${id}`);
            toast.success('Xóa khách hàng thành công');
            fetchCustomers(); // Refresh customer list after deletion
        } catch (error) {
            toast.error('Lỗi khi xóa khách hàng');
        }
    };

    // Create a new customer
    const createCustomer = async (params: CreateCustomerParams) => {
        try {
            await axiosClient.post(`${baseUrl}/customers`, {
                name: params.name,
                phone: params.phone,
                status: 2,
            });
            toast.success('Thêm khách hàng thành công');
            fetchCustomers(); // Refresh customer list after creation
        } catch (error) {
            toast.error('Lỗi khi thêm khách hàng');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const contextValue = useMemo(
        () => ({
            customers,
            isLoading,
            refreshCustomers: fetchCustomers,
            updateCustomer,
            deleteCustomer,
            createCustomer, // Added to the context value
        }),
        [customers, isLoading]
    );

    return (
        <ManageCustomerContext.Provider value={contextValue}>{children}</ManageCustomerContext.Provider>
    );
};

export const useManageCustomerContext = () => {
    const context = useContext(ManageCustomerContext);
    if (!context) {
        throw new Error('useManageCustomerContext must be used within a ManageCustomerProvider');
    }
    return context;
};
