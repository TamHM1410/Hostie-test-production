/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';

interface Report {
    id: number;
    bookingId: number;
    residenceId: number;
    residenceName: string;
    reporterName: string;
    hostName: string;
    reportType: string;
    severity: string;
    title: string;
    description: string;
    status: string;
    adminNote?: string;
    resolvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface ReportListContextProps {
    rows: Report[];
    totalRecords: number;
    page: number;
    setPage: (page: number) => void;
    isLoading: boolean;
    fetchReportDetail: (id: number) => Promise<void>;
    fetchReports: () => void;
    detail: Report | null;
    updateReportStatus: (reportId: number, status: string, adminNote?: string) => Promise<void>;
    createReport: (residenceId: any, bookingId: any, reportType: any, severity: any, title: any, description: any, images: any) => Promise<void>
}

const ReportListContext = createContext<ReportListContextProps | undefined>(undefined);

const ROWS_PER_PAGE = 100000;

const baseUrl = 'https://api.thehostie.com/v1/api/reports';

export const ReportListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rows, setRows] = useState<Report[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [detail, setDetail] = useState<Report | null>(null);
    const { data: session } = useSession();
    const userToken = session?.user.token;

    // Configure Axios to include the user token in headers
    const axiosInstance = useMemo(() => {
        const instance = axios.create();
        if (userToken) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        }
        return instance;
    }, [userToken]);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`${baseUrl}/my-reports`, {
                params: { page: 0, page_size: ROWS_PER_PAGE },
            });
            setRows(response.data.result);
            setTotalRecords(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReportDetail = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`${baseUrl}/my-reports/${id}`);
            setDetail(response.data.data);
        } catch (error) {
            console.error('Error fetching report details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateReportStatus = async (reportId: number, status: string, adminNote?: string) => {
        try {
            setIsLoading(true);
            await axiosInstance.patch(`${baseUrl}/my-reports/${reportId}`, {
                status,
                adminNote,
            });
            toast.success('Cập nhật trạng thái báo cáo thành công');
            fetchReports(); // Refresh the reports list
        } catch (error) {
            toast.error('Cập nhật trạng thái báo cáo thất bại');
        } finally {
            setIsLoading(false);
        }
    };
    const createReport = async (residenceId: any, bookingId: any, reportType: any, severity: any, title: any, description: any, images: any) => {
        console.log(images);

        try {
            setIsLoading(true);

            // Create a new FormData object
            const formData = new FormData();
            formData.append('residenceId', residenceId);
            formData.append('bookingId', bookingId);
            formData.append('reportType', reportType);
            formData.append('severity', severity);
            formData.append('title', title);
            formData.append('description', description);

            images?.forEach((file) => {
                formData.append('evidenceFiles', file);
            });


            // Send the request with FormData
            await axiosInstance.post(`${baseUrl}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Tạo báo cáo thành công');
            fetchReports(); // Refresh the reports list
        } catch (error) {
            console.error('Error creating report:', error);
            toast.error('Tạo báo cáo thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const value = useMemo(
        () => ({
            rows,
            totalRecords,
            page,
            setPage,
            isLoading,
            detail,
            fetchReportDetail,
            fetchReports,
            updateReportStatus,
            createReport,
        }),
        [rows, totalRecords, page, isLoading, detail]
    );

    useEffect(() => {
        fetchReports();
    }, [page]);

    return (
        <ReportListContext.Provider value={value}>
            {children}
        </ReportListContext.Provider>
    );
};

export const useReportListContext = (): ReportListContextProps => {
    const context = useContext(ReportListContext);
    if (!context) {
        throw new Error('useReportListContext must be used within a ReportListProvider');
    }
    return context;
};
