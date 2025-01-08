/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { Chip, IconButton, Tooltip, Typography, Box, Dialog, DialogTitle, DialogContent, Autocomplete, TextField, DialogActions, Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { MRT_Localization_VI } from 'material-react-table/locales/vi'; // Nhập localization tiếng Việt
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useHoldListContext } from 'src/auth/context/hold-list-context/HoldListContext';
import { useBooking } from 'src/auth/context/service-context/BookingContext';
import { BookingFormDialog } from './BookingFormHold';


interface HoldData {
    id: number;
    residence_name: string;
    seller_name: string;
    checkin: string;
    checkout: string;
    is_host_accept: boolean;
    status: number;
    residence_id: number;
}

interface HoldListTableProps {
    rows: HoldData[];
}

const HoldListTable: React.FC<HoldListTableProps> = ({ rows }) => {
    const { fetchDataDetail, detail, cancelHold, fetchData } = useHoldListContext();
    const { customerList, fetchListCustomer, handleBookingSubmit, priceQuotation, fetchPriceQuotation } = useBooking() as any;
    const [isBookingForm, setIsBookingForm] = useState(false);
    const [isCancelHold, setIsCancelHold] = useState(false);
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()



    useEffect(() => {
        fetchListCustomer();
    }, []);

    const renderStatusChip = (status: number): JSX.Element => {
        switch (status) {
            case 3:
                return <Chip label="Đã đặt " color="success" variant="soft"  />;
            case 2:
                return <Chip label="Đã xác nhận" color="success" variant="soft"  />;
            case 1:
                return <Chip label="Chờ xác nhận" color="warning" variant="soft"  />;
            default:
                return <Chip label="Đã hủy" color="error" variant="soft"  />;
        }
    };

    const columns: MRT_ColumnDef<HoldData>[] = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'Mã Giữ Chỗ',
            size: 100,
            Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: 'expire',
            header: 'Thời gian giữ',
            size: 200,
            Cell: ({ cell }: any) => <Typography >{cell.getValue()} Phút</Typography>,
        },
        {
            accessorKey: 'residence_name',
            header: 'Tên Nơi Lưu Trú',
            size: 200,
            Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: 'checkin',
            header: 'Ngày Nhận Phòng',
            size: 150,
            Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: 'checkout',
            header: 'Ngày Trả Phòng',
            size: 150,
            Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
        },
        {
            accessorKey: 'status',
            header: 'Trạng Thái',
            size: 150,
            Cell: ({ cell }: any) => renderStatusChip(cell.getValue()),
        },
        {
            accessorKey: 'action',
            header: 'Thao tác',
            size: 150,
            Cell: ({ row }) => (
                <Box display="flex">
                    {row.original.status === 2 && (
                        <>
                            <Tooltip title="Đặt nơi lưu trú">
                                <IconButton color="success" aria-label="book" onClick={async () => {
                                    setStartDate(row.original.checkin)
                                    setEndDate(row.original.checkout)
                                    await fetchDataDetail(row.original.id);
                                    await fetchPriceQuotation(row.original.checkin, row.original.checkout, row.original.residence_id)

                                    setIsBookingForm(true);
                                }}>
                                    <CheckCircleIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Hủy giữ nơi lưu trú">
                                <IconButton color="error" aria-label="cancel" onClick={() => {
                                    setIsCancelHold(true);
                                    fetchDataDetail(row.original.id);

                                }}>
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    {row.original.status === 1 && (
                        <Tooltip title="Hủy giữ nơi lưu trú">
                            <IconButton color="error" aria-label="cancel" onClick={() => {
                                setIsCancelHold(true);
                                fetchDataDetail(row.original.id);
                            }}>
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {/* Status 0 and 3: No buttons rendered */}
                </Box>
            ),
        },
    ], [rows]);

    const handleCancelHold = () => {
        if (detail.id !== null) {
            cancelHold(detail.id, detail.checkin, detail.checkout);
            setIsCancelHold(false);
        }
    };
    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={rows || []}
                enablePagination
                enableSorting
                enableTopToolbar
                localization={MRT_Localization_VI}
                muiSearchTextFieldProps={{
                    placeholder: 'Tìm kiếm tên khách hàng',

                }}
            />
            <BookingFormDialog
                fetchPriceQuotation={fetchPriceQuotation}
                isOpen={isBookingForm}
                onClose={() => setIsBookingForm(false)}
                customerList={customerList}
                priceQuotation={priceQuotation}
                detail={detail}
                handleBookingSubmit={handleBookingSubmit}
                fetchData={fetchData}
            />

            {isCancelHold && (
                <Dialog open={isCancelHold} onClose={() => setIsCancelHold(false)}>
                    <DialogTitle>Xác Nhận Hủy Giữ Chỗ</DialogTitle>
                    <DialogContent>
                        <Typography>Bạn có chắc chắn muốn hủy giữ chỗ này không?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCancelHold(false)} color='primary'>Hủy</Button>
                        <Button onClick={handleCancelHold} color="error">Xác Nhận</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default HoldListTable;
