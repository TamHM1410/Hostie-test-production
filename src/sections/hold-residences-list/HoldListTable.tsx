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
                return <Chip label="Đã đặt nơi lưu trú" color="success" variant="outlined" sx={{ borderRadius: 30 }} />;
            case 2:
                return <Chip label="Đã xác nhận" color="success" variant="outlined" sx={{ borderRadius: 30 }} />;
            case 1:
                return <Chip label="Chờ xác nhận" color="warning" variant="outlined" sx={{ borderRadius: 30 }} />;
            default:
                return <Chip label="Đã hủy" color="error" variant="outlined" sx={{ borderRadius: 30 }} />;
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
            header: 'Hành Động',
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
            {isBookingForm && (
                <Dialog open={isBookingForm} onClose={() => setIsBookingForm(false)}>
                    <DialogTitle>Đặt Chỗ Cho {detail?.residence_name}</DialogTitle>
                    <DialogContent>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2, // khoảng cách giữa các thành phần
                                paddingBottom: 2,
                                borderBottom: '1px solid #e0e0e0', // viền ngăn cách
                                marginBottom: 3
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">Tổng Giá:</Typography>
                                <Typography variant="body1" color="primary">{priceQuotation?.total_price || 0} VND</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">Hoa Hồng Nhận Được:</Typography>
                                <Typography variant="body1" color="secondary">{priceQuotation?.commission_rate || 0}%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">Số ngày:</Typography>
                                <Box>
                                    <Typography variant="body1" color="green">
                                        {priceQuotation ? priceQuotation.total_days + 1 : 0} ngày
                                    </Typography>
                                    <Typography variant="body1" color="green">
                                        {priceQuotation?.total_days || 0} đêm
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Formik


                            initialValues={{
                                guest_id: '',
                                guest_count: 1,
                                start_date: startDate,
                                end_date: endDate,
                                residence_id: detail?.residence_id || '',
                                hold_id: detail?.id,
                                note: '',
                            }}
                            validationSchema={Yup.object({
                                guest_id: Yup.string().required('Tên khách hàng là bắt buộc.'),
                                guest_count: Yup.number()
                                    .min(1, 'Số lượng khách phải lớn hơn 0.')
                                    .required('Số lượng khách là bắt buộc.'),
                                note: Yup.string().optional(),
                            })}
                            onSubmit={async (values, { setSubmitting, setFieldError }) => {
                                try {
                                    await handleBookingSubmit(values);
                                    fetchData();
                                    setSubmitting(false);
                                } catch (error) {
                                    setFieldError('guest_id', 'Có lỗi xảy ra khi đặt chỗ. Vui lòng thử lại.');
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ handleChange, handleBlur, values, errors, touched, setFieldValue }) => (
                                <Form>
                                    <Autocomplete
                                        options={customerList?.data || []}
                                        getOptionLabel={(option: any) => option.name}
                                        onChange={(event, newValue) => {
                                            setFieldValue("guest_id", newValue ? newValue.id : '');
                                        }}
                                        sx={{ marginTop: '10px' }}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.name}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tên Khách Hàng"
                                                error={touched.guest_id && Boolean(errors.guest_id)}
                                                helperText={touched.guest_id && errors.guest_id}
                                            />
                                        )}
                                    />
                                    <TextField
                                        label="Số Lượng Khách"
                                        type="number"
                                        name="guest_count"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        margin="dense"
                                        value={values.guest_count}
                                        error={touched.guest_count && Boolean(errors.guest_count)}
                                        helperText={touched.guest_count && errors.guest_count}
                                    />
                                    <TextField
                                        label="Ngày Bắt Đầu"
                                        value={detail?.checkin}
                                        disabled
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Ngày Kết Thúc"
                                        value={detail?.checkout}
                                        disabled
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Ghi Chú"
                                        name="note"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        margin="dense"
                                        value={values.note}
                                    />
                                    <DialogActions>
                                        <Button onClick={() => setIsBookingForm(false)} color='primary'>Hủy</Button>
                                        <Button type="submit" color="success">Đặt</Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>

            )}
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
