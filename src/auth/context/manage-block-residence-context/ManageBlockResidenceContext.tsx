/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';

interface ResidenceBlock {
    id: number;
    residence_id: number;
    start_date: string;
    end_date: string;
    reason: string;
    status: number;
    created_at: string;
    updated_at: string;
}

interface ResidenceBlockContextProps {
    blocks: ResidenceBlock[];
    isLoading: boolean;
    fetchBlocks: (id: any) => void;
    createBlock: (data: Partial<ResidenceBlock>) => Promise<void>;
    updateBlock: (id: number, data: Partial<ResidenceBlock>) => Promise<void>;
    deleteBlock: (id: number, residence_id: any) => Promise<void>;
}

const ResidenceBlockContext = createContext<ResidenceBlockContextProps | undefined>(undefined);

const baseUrl = 'https://core-api.thehostie.com/residences/block';

export const ResidenceBlockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [blocks, setBlocks] = useState<ResidenceBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    const fetchBlocks = async (id: any) => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`${baseUrl}/${id}`);
            setBlocks(response.data.residence_block);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chặn:', error);
            toast.error('Không thể lấy danh sách chặn.');
        } finally {
            setIsLoading(false);
        }
    };

    const createBlock = async (data: Partial<ResidenceBlock>) => {
        try {
            setIsLoading(true);
            console.log(data)
            await axiosClient.post(`${baseUrl}`, data);
            toast.success('Tạo khoảng thời gian chặn thành công.');
            fetchBlocks(data.residence_id);
        } catch (error) {
            console.error('Lỗi khi tạo khoảng thời gian chặn:', error);
            toast.error('Không thể tạo khoảng thời gian chặn.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateBlock = async (id: number, data: Partial<ResidenceBlock>) => {
        try {
            setIsLoading(true);
            await axiosClient.put(`${baseUrl}/${id}`, data);
            toast.success('Cập nhật khoảng thời gian chặn thành công.');
            fetchBlocks();
        } catch (error) {
            console.error('Lỗi khi cập nhật khoảng thời gian chặn:', error);
            toast.error('Không thể cập nhật khoảng thời gian chặn.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBlock = async (id: number, residence_id: any) => {
        try {
            setIsLoading(true);
            await axiosClient.delete(`${baseUrl}/?ids=${id}`);
            toast.success('Xóa khoảng thời gian chặn thành công.');
            fetchBlocks(residence_id);
        } catch (error) {
            console.error('Lỗi khi xóa khoảng thời gian chặn:', error);
            toast.error('Không thể xóa khoảng thời gian chặn.');
        } finally {
            setIsLoading(false);
        }
    };

    const value = useMemo(
        () => ({
            blocks,
            isLoading,
            fetchBlocks,
            createBlock,
            updateBlock,
            deleteBlock,
        }),
        [blocks, isLoading]
    );



    return (
        <ResidenceBlockContext.Provider value={value}>
            {children}
        </ResidenceBlockContext.Provider>
    );
};

export const useResidenceBlockContext = (): ResidenceBlockContextProps => {
    const context = useContext(ResidenceBlockContext);
    if (!context) {
        throw new Error('useResidenceBlockContext phải được sử dụng trong ResidenceBlockProvider');
    }
    return context;
};
