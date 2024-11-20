/* eslint-disable no-nested-ternary */

'use client';

import { useState } from 'react';
import {
    Container,

} from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import BookingHistoryTable from './BookingHistoryOfServiceTable';
import { bookingData } from './data';

const ROWS_PER_PAGE = 10;

export default function BookingHistoryOfServiceView() {
    const settings = useSettingsContext();
    const [rows] = useState(bookingData);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof typeof bookingData[0]>('id');
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const handleSort = (property: keyof typeof bookingData[0]) => {
        setOrder((prevOrder) =>
            orderBy === property && prevOrder === 'asc' ? 'desc' : 'asc'
        );
        setOrderBy(property);
    };

    const isWithinDateRange = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        switch (dateFilter) {
            case 'hôm nay':
                return date.toDateString() === today.toDateString();
            case '1 ngày trước':
                yesterday.setDate(today.getDate() - 1);
                return date.toDateString() === yesterday.toDateString();
            case 'last7days':
                return date >= new Date(today.setDate(today.getDate() - 7));
            case 'last15days':
                return date >= new Date(today.setDate(today.getDate() - 15));
            case 'last30days':
                return date >= new Date(today.setDate(today.getDate() - 30));
            case 'custom':
                return startDate && endDate && date >= startDate && date <= endDate;
            default:
                return true;
        }
    };

    const filteredRows = rows.filter((row) => {
        const matchesSearchTerm = Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

        const bookingDate = new Date(row.checkinDate); // Use checkinDate instead of bookingDate
        const withinDateRange = isWithinDateRange(bookingDate);

        return matchesSearchTerm && withinDateRange;
    });

    const sortedRows = [...filteredRows].sort((a, b) => {
        const compareValue = a[orderBy] < b[orderBy] ? -1 : 1;
        return order === 'asc' ? compareValue : -compareValue;
    });

    const paginatedRows = sortedRows.slice(
        (page - 1) * ROWS_PER_PAGE,
        page * ROWS_PER_PAGE
    );



    const handleEdit = (id: string) => {
        console.log('Edit booking with ID:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete booking with ID:', id);
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>

            <BookingHistoryTable
                rows={paginatedRows}
                order={order}
                orderBy={orderBy}
                handleSort={handleSort}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

        </Container>
    );
}


