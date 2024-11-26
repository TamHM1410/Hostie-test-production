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

    Menu,
    Snackbar,
    Alert,


} from '@mui/material';


import { useBooking } from 'src/auth/context/service-context/BookingContext';
import { useSession } from 'next-auth/react';
import HoldingFormDialog from './HoldingForm';

import BookingFormDialog from './BookingDialogForm';
import './Booking.Module.css';


export function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN') + ' VND';
}
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
        fetchPolicy,
        fetchPriceQuotation,
        priceQuotation

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
        // Load saved search parameters from localStorage
        const savedParams = localStorage.getItem('searchParams');
        if (savedParams) {
            const parsedParams = JSON.parse(savedParams);
            console.log(parsedParams);

            // Destructure saved data
            const {
                selectedProvince,
                selectedAccommodationType,
                dateRange,
                maxPrice
            } = parsedParams;

            // Use the loaded values in your API calls
            fetchBookingData(
                currentPage,
                year,
                selectedMonth,
                selectedProvince,
                selectedAccommodationType,
                dateRange,
                maxPrice
            );
        } else {
            // If no saved data, fetch with default values
            fetchBookingData(currentPage, year, selectedMonth);
        }

        // Fetch customer list as well (assuming this doesn't depend on the search parameters)
        fetchListCustomer();
    }, [selectedMonth, currentPage]); // Dependencies to re-fetch on change

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
        event.preventDefault(); // Prevent default right-click menu on right-click

        if (event.button === 0) {
            // Left-click (Select/Extend Selection)
            if (!selectionRange) {
                // Start a new selection range
                setSelectionRange({ villaName, start: day, end: day, residence_id });
                setSelectedVillaName(villaName);
            } else if (selectionRange.villaName === villaName) {
                // Extend or shrink the range
                const newStart = Math.min(selectionRange.start, day);
                const newEnd = Math.max(selectionRange.end, day);
                if (selectionRange.start === day && selectionRange.end === day) {
                    // Reset if clicking the same cell
                    setSelectionRange(null);
                    setSelectedVillaName('');
                } else {
                    setSelectionRange({ villaName, start: newStart, end: newEnd, residence_id });
                }
            } else {
                // Start a new range for a different villa
                setSelectionRange({ villaName, start: day, end: day, residence_id });
                setSelectedVillaName(villaName);
            }
        } else if (event.button === 2) {
            // Right-click (Open Context Menu)
            if (!selectionRange || Math.abs(selectionRange.end - selectionRange.start) < 1) {
                // Invalid range selection
                setSnackbarMessage('Vui lòng chọn ít nhất 2 ngày.');
                setSnackbarOpen(true);
            } else {
                setAnchorEl(event.currentTarget);
                setContextMenuOpen(true);
            }
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
    const handleActionSelect = async (action: 'book' | 'hold') => {
        await fetchPriceQuotation(`${String(selectionRange?.start).padStart(2, '0')}-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
            }-${year}`, `${String(selectionRange?.end).padStart(2, '0')}-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
            }-${year}`, parseInt(selectionRange?.residence_id))
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
                                            <MenuItem key={i + 1} value={`${i + 1}`}>
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
                        {bookingData?.length === 0 || null ? (
                            <tr>
                                <td colSpan={daysInMonth.length + 1} style={{ textAlign: 'center' }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (bookingData?.map((villa: any) => (
                            <tr key={villa.name}>
                                <td className="villa-name">
                                    <div
                                        className="villa-name-cell"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => { fetchResidenceInfor(villa.id); fetchPolicy(villa.id) }}
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
                                            <div className="corner-number">{bookingInfo ? `${bookingInfo.price}VND` : 'N/A'}</div>

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
                        )))}
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
                <BookingFormDialog
                    isBookingForm={isBookingForm}
                    setIsBookingForm={setIsBookingForm}
                    selectedVillaName={selectedVillaName}
                    priceQuotation={priceQuotation}
                    customerList={customerList}
                    startDate={startDate}
                    endDate={endDate}
                    selectionRange={selectionRange}
                    handleBookingSubmit={handleBookingSubmit}
                />
            )}
            {/* Biểu Mẫu Giữ Chỗ Dialog */}
            {isHoldingForm && (
                <HoldingFormDialog
                    isHoldingForm={isHoldingForm}
                    setIsHoldingForm={setIsHoldingForm}
                    selectedVillaName={selectedVillaName}
                    startDate={startDate}
                    endDate={endDate}
                    onSubmitHolding={onSubmitHolding}
                />
            )}
        </div>
    );
};

export default BookingDashboard;
