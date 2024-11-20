/* eslint-disable radix */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-shorthand */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import {
    MenuItem,
    Select,
    FormControl,
    Pagination,
    Backdrop,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Menu,
    Snackbar,
    Alert,
    Autocomplete,
} from '@mui/material';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import './Booking.Module.css';
import { useBooking } from 'src/auth/context/service-context/BookingContext';
import { useSession } from 'next-auth/react';

const BookingDashboard = ({ month, year }: { month: any; year: any }) => {
    const {
        bookingData,
        totalPages,
        currentPage,
        loading,
        setCurrentPage,
        fetchBookingData,
        handleHoldingSubmit,
        handleBookingSubmit,
        fetchListCustomer,
        customerList,
        fetchResidenceInfor,
    } = useBooking() as any;

    const [selectedMonth, setSelectedMonth] = useState(month);
    const [daysInMonth, setDaysInMonth] = useState<{ day: number; dayOfWeek: string }[]>([]);
    // Trạng thái mới để theo dõi khoảng chọn

    const [selectionRange, setSelectionRange] = useState<{
        villaName: string;
        start: number;
        end: number;
        residence_id: string;
    } | null>(null);

    const { data: session } = useSession()

    const user_name: any = session?.user?.id;

    // Trạng thái cho menu ngữ cảnh

    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [actionType, setActionType] = useState<'book' | 'hold' | null>(null);

    // Trạng thái cho biểu mẫu đặt chỗ và giữ chỗ
    const [startDate, setStartDate] = useState<string>('');

    const [endDate, setEndDate] = useState<string>('');

    // cờ để chuyển đổi tính năng của biểu mẫu

    const [isBookingForm, setIsBookingForm] = useState(false);
    const [isHoldingForm, setIsHoldingForm] = useState(false);

    // message

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedVillaName, setSelectedVillaName] = useState('');

    useEffect(() => {
        fetchBookingData(selectedMonth, year, currentPage);
        fetchListCustomer();
    }, [selectedMonth, currentPage]);

    useEffect(() => {
        const daysInCurrentMonth = new Date(year, selectedMonth, 0).getDate();
        const daysArray = Array.from({ length: daysInCurrentMonth }, (_, i) => {
            const date = new Date(2024, selectedMonth - 1, i + 1);
            return {
                day: i + 1,
                dayOfWeek: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][(date.getUTCDay() + 7) % 7],
            };
        });
        setDaysInMonth(daysArray);
    }, [selectedMonth]);

    const handleCellClick = (
        villaName: string,
        day: number,
        residence_id: string,
        event: React.MouseEvent<HTMLTableCellElement>
    ) => {
        if (event.button === 0) {
            // Left-click
            if (!selectionRange) {
                setSelectionRange({ villaName, start: day, end: day, residence_id });
                setSelectedVillaName(villaName);
            } else {
                if (selectionRange.villaName === villaName) {
                    const newStart = Math.min(selectionRange.start, day);
                    const newEnd = Math.max(selectionRange.end, day);
                    setSelectionRange({ villaName, start: newStart, end: newEnd, residence_id });
                    setSelectedVillaName(villaName);
                } else {
                    setSelectionRange({ villaName, start: day, end: day, residence_id });
                    setSelectedVillaName(villaName);
                }
            }
        } else if (event.button === 2) {
            // Right-click
            if (!selectionRange || Math.abs(selectionRange.end - selectionRange.start) < 1) {
                setSnackbarMessage('Vui lòng chọn ít nhất 2 ngày.');
                setSnackbarOpen(true);
                return;
            }
            setActionType(null);
            setAnchorEl(event.currentTarget);
            setContextMenuOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const isCellSelected = (villaName: string, day: number) => {
        if (selectionRange) {
            return (
                selectionRange.villaName === villaName &&
                day >= Math.min(selectionRange.start, selectionRange.end) &&
                day <= Math.max(selectionRange.start, selectionRange.end)
            );
        }
        return false;
    };

    const handleContextMenuClose = () => {
        setContextMenuOpen(false);
        setAnchorEl(null);
    };

    const handleActionSelect = (action: 'book' | 'hold') => {
        setActionType(action);
        setStartDate(
            `${String(selectionRange?.start).padStart(2, '0')}-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
            }-${year}`
        );
        // Set End Date in DD-MM-YYYY format
        setEndDate(
            `${String(selectionRange?.end).padStart(2, '0')}-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
            }-${year}`
        );
        handleContextMenuClose();

        if (action === 'book') {
            setIsBookingForm(true);
        } else {
            setIsHoldingForm(true);
        }
    };

    const onSubmitHolding = (values: { expire: number }) => {
        if (!selectionRange) return;

        // Extract the necessary data
        const { expire } = values;

        // Pass all necessary values to the submission handler
        handleHoldingSubmit(selectionRange.residence_id, startDate, endDate, expire);

        // Close the dialog after successful submission
        setIsHoldingForm(false);
    };

    return (
        <div className="booking-dashboard" onContextMenu={(e) => e.preventDefault()}>
            {' '}
            {/* Ngăn menu ngữ cảnh mặc định */}
            <Backdrop open={loading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="sticky-header">
                                <FormControl fullWidth>
                                    <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <MenuItem key={i + 1} value={i + 1}>
                                                Tháng {i + 1}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </th>
                            {daysInMonth.map((day) => (
                                <th
                                    key={day.day}
                                    className={`day-header ${['T7', 'CN', 'T6'].includes(day.dayOfWeek) ? 'weekend-header' : ''
                                        }`}
                                >
                                    <div>{day.dayOfWeek}</div>
                                    <div className="weekend-text">{day.day}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bookingData?.map((villa: any) => (
                            <tr key={villa.name}>
                                <td className="villa-name">
                                    <div
                                        className="villa-name-cell"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => fetchResidenceInfor(villa.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                fetchResidenceInfor(villa.id);
                                            }
                                        }}
                                    >
                                        {villa.name}
                                    </div>
                                </td>
                                {daysInMonth.map((day) => {
                                    const utcPlus7Date = new Date(Date.UTC(2024, selectedMonth - 1, day.day));
                                    utcPlus7Date.setUTCHours(7, 0, 0, 0);
                                    const formattedDate = utcPlus7Date.toISOString().split('T')[0];
                                    const bookingInfo = villa.calendar.find((item: any) =>
                                        item.date.startsWith(formattedDate)
                                    );

                                    // Determine if the cell should have a light yellow background
                                    const isHostAccepted = bookingInfo && bookingInfo.waiting_down_payment === true;

                                    // Determine if the cell should have a light blue background
                                    const isBooked = bookingInfo && bookingInfo.is_booked === true;

                                    return (
                                        <td
                                            key={day.day}
                                            className={`day-cell clickable ${isHostAccepted ? 'host-accepted' : ''} ${isBooked ? 'booked' : ''
                                                }`}
                                            style={{ backgroundColor: bookingInfo?.background_color || 'inherit' }}
                                            onClick={(e) => handleCellClick(villa.name, day.day, villa.id, e)}
                                            onContextMenu={(e) => handleCellClick(villa.name, day.day, villa.id, e)}
                                        >
                                            {isCellSelected(villa.name, day.day) && (
                                                <div className="selected"></div> // This will be styled to create the border effect
                                            )}
                                            <div className="corner-number">{bookingInfo ? bookingInfo.price : 'N/A'}</div>

                                            {/* Rectangle based on start_point, middle_point, end_point */}
                                            {bookingInfo && bookingInfo.start_point && (
                                                <div className="rectangle start-point">
                                                    <img
                                                        src={
                                                            bookingInfo.avatar_seller !== null
                                                                ? bookingInfo.avatar_seller
                                                                : 'https://images.pexels.com/photos/825904/pexels-photo-825904.jpeg?cs=srgb&dl=pexels-olly-825904.jpg&fm=jpg'
                                                        }
                                                        alt="Avatar"
                                                        className="avatar"
                                                    />
                                                </div>
                                            )}

                                            {bookingInfo && bookingInfo.middle_point && (
                                                <div className="rectangle middle-point">
                                                    {bookingInfo.seller_username?.length <= 3 ? (
                                                        <div className="seller-name">
                                                            {bookingInfo.seller_username || 'Seller'}
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                </div>
                                            )}

                                            {bookingInfo && bookingInfo.end_point && (
                                                <div className="rectangle end-point">
                                                    <div className="seller-name">
                                                        {parseInt(user_name) === bookingInfo?.seller_id
                                                            ? 'Bạn'
                                                            : bookingInfo.seller_username || 'Seller'}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}
            />
            {/* Menu Ngữ Cảnh */}
            <Menu anchorEl={anchorEl} open={contextMenuOpen} onClose={handleContextMenuClose}>
                <MenuItem onClick={() => handleActionSelect('book')}>Đặt Chỗ</MenuItem>
                <MenuItem onClick={() => handleActionSelect('hold')}>Giữ Chỗ</MenuItem>
            </Menu>
            {/* Biểu Mẫu Đặt Chỗ Dialog */}
            {/* Booking Form Dialog */}
            {isBookingForm && (
                <Dialog open={isBookingForm} onClose={() => setIsBookingForm(false)}>
                    <DialogTitle>Đặt Chỗ Cho {selectedVillaName} </DialogTitle>
                    <DialogContent>
                        <Formik
                            initialValues={{
                                guest_id: '',
                                guest_count: 1,
                                start_date: startDate,
                                end_date: endDate,
                                residence_id: selectionRange?.residence_id || '',
                                paid_amount: 500,
                                note: '',
                            }}
                            validationSchema={Yup.object({
                                guest_id: Yup.string().required('Tên khách hàng là bắt buộc.'),
                                guest_count: Yup.number()
                                    .min(1, 'Số lượng khách phải lớn hơn 0.')
                                    .required('Số lượng khách là bắt buộc.'),
                                paid_amount: Yup.number()
                                    .min(500, 'Số tiền đã thanh toán không hợp lệ.')
                                    .required('Số tiền đã thanh toán là bắt buộc.'),
                                note: Yup.string().optional(),
                            })}
                            onSubmit={(values) => {
                                if (!selectionRange) return;
                                handleBookingSubmit(values); // Ensure this returns a promise
                                setIsBookingForm(false); // Close the dialog after successful submission
                            }}
                        >
                            {({ handleChange, handleBlur, values, errors, touched, setFieldValue }) => (
                                <Form>
                                    <Autocomplete
                                        options={customerList?.data}
                                        getOptionLabel={(option: any) => option.name}
                                        onChange={(event, newValue) => {
                                            setFieldValue('guest_id', newValue ? newValue.id : '');
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
                                        error={touched.guest_count && Boolean(errors.guest_count)}
                                        helperText={touched.guest_count && errors.guest_count}
                                    />

                                    <TextField
                                        label="Số Tiền Cần Thanh Toán"
                                        type="number"
                                        name="paid_amount"
                                        inputProps={{ min: 500, max: 5000 }}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.paid_amount}
                                        fullWidth
                                        margin="dense"
                                        error={touched.paid_amount && Boolean(errors.paid_amount)}
                                        helperText={
                                            touched.paid_amount && errors.paid_amount
                                                ? errors.paid_amount
                                                : `Số tiền đã nhập: ${values.paid_amount} / 5000`
                                        }
                                    />

                                    <TextField
                                        label="Ngày Bắt Đầu"
                                        value={startDate}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Ngày Kết Thúc"
                                        value={endDate}
                                        InputProps={{
                                            readOnly: true,
                                        }}
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
                                        multiline
                                        rows={4}
                                    />

                                    <DialogActions>
                                        <Button onClick={() => setIsBookingForm(false)} color="primary">
                                            Hủy
                                        </Button>
                                        <Button type="submit" color="primary">
                                            Xác Nhận
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>
            )}
            {/* Biểu Mẫu Giữ Chỗ Dialog */}
            {isHoldingForm && (
                <Dialog open={isHoldingForm} onClose={() => setIsHoldingForm(false)}>
                    <DialogTitle>Giữ Chỗ Cho {selectedVillaName}</DialogTitle>
                    <DialogContent>
                        <Formik
                            initialValues={{
                                start_date: startDate,
                                end_date: endDate,
                                expire: '',
                            }}
                            validationSchema={Yup.object({
                                expire: Yup.number()
                                    .min(1, 'Hạn giữ chỗ phải lớn hơn 0.')
                                    .max(100, 'Hạn giữ chỗ phải nhỏ hơn 100 phút.')
                                    .required('Hạn giữ chỗ là bắt buộc.'),
                            })}
                            onSubmit={(values: any) => {
                                onSubmitHolding(values); // Ensure this function handles the submission
                            }}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                values,
                                errors,
                                touched,
                            }: {
                                handleChange: any;
                                handleBlur: any;
                                values: any;
                                errors: any;
                                touched: any;
                            }) => (
                                <Form>
                                    <TextField
                                        label="Ngày Bắt Đầu"
                                        value={startDate}
                                        fullWidth
                                        margin="dense"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        label="Ngày Kết Thúc"
                                        value={endDate}
                                        fullWidth
                                        margin="dense"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />

                                    <TextField
                                        label="Hạn Giữ Chỗ (Phút)"
                                        type="number"
                                        name="expire"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.expire}
                                        fullWidth
                                        margin="dense"
                                        error={touched.expire && Boolean(errors.expire)}
                                        helperText={touched.expire && errors.expire}
                                    />

                                    <DialogActions>
                                        <Button onClick={() => setIsHoldingForm(false)} color="primary">
                                            Hủy
                                        </Button>
                                        <Button type="submit" color="primary">
                                            Xác Nhận
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default BookingDashboard;
