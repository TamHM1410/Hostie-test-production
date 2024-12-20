'use client'
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
  Grid,
} from '@mui/material';

import './Booking.Module.css';
import { useBooking } from 'src/auth/context/service-context/BookingContext';
import { useSession } from 'next-auth/react';
import HoldingFormDialog from './HoldingForm';
import BookingFormDialog from './BookingDialogForm';
import { formattedAmount } from 'src/utils/format-time';
import toast from 'react-hot-toast';
import ColorNotes from './ColorNote';
import Card from '@mui/material/Card';

const BookingDashboard = ({
  selectedMonth,
  year,
  setSelectedMonth,
  setYears,
}: {
  setYears: any;
  selectedMonth: number;
  year: any;
  setSelectedMonth: any;
}) => {
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
    priceQuotation,
    fetchImages,
  } = useBooking() as any;

  // const [selectedMonth, setSelectedMonth] = useState(month);
  const [daysInMonth, setDaysInMonth] = useState<{ day: number; dayOfWeek: string }[]>([]);
  // Trạng thái mới để theo dõi khoảng chọn

  const [selectionRange, setSelectionRange] = useState<{
    villaName: string;
    start: number;
    end: number;
    residence_id: string;
  } | null>(null);

  const { data: session } = useSession();

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
    if (typeof window !== 'undefined') {
      // Đảm bảo chạy trong môi trường client
      const savedParams = localStorage.getItem('searchParams');
      if (savedParams) {
        const parsedParams = JSON.parse(savedParams);
        // Destructure saved data
        const {
          selectedProvince,
          selectedAccommodationType,
          startDate1,
          endDate1,
          priceRange,
          iconFilter, // Lấy dữ liệu priceRange từ params
        } = parsedParams;
  
        // Map minPrice và maxPrice từ priceRange
        const minPrice = priceRange[0];
        const maxPrice = priceRange[1];
  
        // Use the loaded values in your API calls
        fetchBookingData(
          currentPage,
          year,
          selectedMonth,
          selectedProvince,
          selectedAccommodationType,
          [startDate1, endDate1],
          maxPrice,
          minPrice,
          iconFilter
        );
      } else {
        // If no saved data, fetch with default values
        fetchBookingData(currentPage, year, selectedMonth);
      }
     
    }
    // Load saved search parameters from localStorage



    

    // Fetch customer list as well (assuming this doesn't depend on the search parameters)
    fetchListCustomer();
  }, [selectedMonth, currentPage, year]); // Dependencies to re-fetch on change

  useEffect(() => {
    const daysInCurrentMonth = new Date(year, selectedMonth, 0).getDate();
    const daysArray = Array.from({ length: daysInCurrentMonth }, (_, i) => {
      const date = new Date(year, selectedMonth - 1, i + 1);
      return {
        day: i + 1,
        dayOfWeek: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][(date.getUTCDay() + 7) % 7],
      };
    });
    setDaysInMonth(daysArray);
  }, [selectedMonth, year]);

  const handleCellClick = (
    villaName: string,
    day: number,
    residence_id: string,
    event: React.MouseEvent<HTMLTableCellElement>,
    disable?: boolean,
    holdStatus?: number,
    isBook?: boolean
  ) => {
    event.preventDefault(); // Prevent default right-click menu on right-click

    const checkSelectedDays = (start: number, end: number): boolean => {
      for (let i = start; i <= end; i++) {
        if (disable === true) {
          toast.error('Ngày này đã bị khóa vui lòng chọn ngày khác');
          return true;
        }

        if (holdStatus === 2) {
          toast.error('Ngày này đã được giữ vui lòng chọn ngày khác');
          return true;
        }

        if (isBook === true) {
          toast.error('Ngày này đã được đặt vui lòng chọn ngày khác');
          return true;
        }
      }
      return false; // No issues with the selected days
    };

    if (event.button === 0) {
      // Left-click (Select/Extend Selection)
      if (!selectionRange) {
        if (checkSelectedDays(day, day)) {
          return; // Stop the execution if the selection range is invalid
        }
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
          if (checkSelectedDays(newStart, newEnd)) {
            return; // Stop the execution if the selection range is invalid
          }
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
    await fetchPriceQuotation(
      `${String(selectionRange?.start).padStart(2, '0')}-${
        selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
      }-${year}`,
      `${String(selectionRange?.end).padStart(2, '0')}-${
        selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
      }-${year}`,
      parseInt(selectionRange?.residence_id)
    );
    setActionType(action);
    setStartDate(
      `${String(selectionRange?.start).padStart(2, '0')}-${
        selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
      }-${year}`
    );
    // Set End Date in DD-MM-YYYY format
    setEndDate(
      `${String(selectionRange?.end).padStart(2, '0')}-${
        selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth
      }-${year}`
    );
    handleContextMenuClose();

    if (action === 'book') {
      if (!customerList.data.length) {
        toast.error(
          'Bạn chưa có khách hàng nào hãy vào trang quản lí khách hàng để tạo mới 1 khách hàng.'
        );
      } else {
        setIsBookingForm(true);
      }
    } else {
      setIsHoldingForm(true);
    }
  };

  const onSubmitBooking = (values: any) => {
    if (!selectionRange) return;

    handleBookingSubmit(values);

    if (savedParams) {
      const parsedParams = JSON.parse(savedParams);
      // Destructure saved data
      const {
        selectedProvince,
        selectedAccommodationType,
        startDate1,
        endDate1,
        priceRange, // Lấy dữ liệu priceRange từ params,
        iconFilter,
      } = parsedParams;

      // Map minPrice và maxPrice từ priceRange
      const minPrice = priceRange[0];
      const maxPrice = priceRange[1];

      // Use the loaded values in your API calls
      fetchBookingData(
        currentPage,
        year,
        selectedMonth,
        selectedProvince,
        selectedAccommodationType,
        [startDate1, endDate1],
        maxPrice,
        minPrice,
        iconFilter
      );
    } else {
      // If no saved data, fetch with default values
      fetchBookingData(currentPage, year, selectedMonth);
    }
  };
  const onSubmitHolding = (values: { expire: number }) => {
    if (!selectionRange) return;

    // Extract the necessary data
    const { expire } = values;

    // Pass all necessary values to the submission handler
    handleHoldingSubmit(selectionRange.residence_id, startDate, endDate, expire);

    if (savedParams) {
      const parsedParams = JSON.parse(savedParams);
      // Destructure saved data
      const {
        selectedProvince,
        selectedAccommodationType,
        startDate1,
        endDate1,
        priceRange,
        iconFilter, // Lấy dữ liệu priceRange từ params
      } = parsedParams;

      // Map minPrice và maxPrice từ priceRange
      const minPrice = priceRange[0];
      const maxPrice = priceRange[1];

      // Use the loaded values in your API calls
      fetchBookingData(
        currentPage,
        year,
        selectedMonth,
        selectedProvince,
        selectedAccommodationType,
        [startDate1, endDate1],
        maxPrice,
        minPrice,
        iconFilter
      );
    } else {
      // If no saved data, fetch with default values
      fetchBookingData(currentPage, year, selectedMonth);
    }
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
      <Card sx={{width:'100%'}}>
      <div className="table-container">
        <table className="table">
          <thead style={{ position: 'relative' }}>
            <tr>
              <th className="sticky-header">
                <Grid container spacing={2}>
                  {/* Month Selector */}
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      >
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = String(i + 1).padStart(2, '0'); // Adds leading zero for months < 10
                          const month2 = parseInt(month);
                          return (
                            <MenuItem key={month} value={month2}>
                              {month}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* Year Selector */}
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Select value={year} onChange={(e) => setYears(Number(e.target.value))}>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year1 = new Date().getFullYear() - 5 + i; // Range: 5 years before and after the current year
                          return (
                            <MenuItem key={year1} value={year1}>
                              {year1}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </th>
              {daysInMonth.map((day) => (
                <th
                  key={day.day}
                  className={`day-header ${
                    ['T7', 'CN', 'T6'].includes(day.dayOfWeek) ? 'weekend-header' : ''
                  }`}
                >
                  <div>{day.dayOfWeek}</div>
                  <div className="weekend-text">{day.day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!bookingData ? (
              <tr>
                <td colSpan={daysInMonth.length + 1}>Không có dữ liệu</td>
              </tr>
            ) : (
              bookingData?.map((villa) => (
                <tr key={villa.name}>
                  <td className="villa-name">
                    <div
                      className="villa-name-cell"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        fetchResidenceInfor(villa.id);
                        fetchPolicy(villa.id);
                        fetchImages(villa.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          fetchResidenceInfor(villa.id);
                        }
                      }}
                      style={{color:'rgb(76 84 90)'}}
                     
                    >
                      {villa.name}
                    </div>
                  </td>
                  {daysInMonth.map((day) => {
                    const utcPlus7Date = new Date(Date.UTC(year, selectedMonth - 1, day.day));
                    utcPlus7Date.setUTCHours(7, 0, 0, 0);
                    const formattedDate = utcPlus7Date.toISOString().split('T')[0];
                    const bookingInfo = villa.calendar.find((item) =>
                      item.date.startsWith(formattedDate)
                    );

                    const isHostAccepted = bookingInfo && bookingInfo.waiting_down_payment === true;
                    const isBooked = bookingInfo && bookingInfo.is_booked === true;

                    return (
                      <td
                        key={day.day}
                        className={`day-cell clickable ${isHostAccepted ? 'host-accepted' : ''} ${
                          isBooked ? 'booked' : ''
                        }`}
                        style={{
                          backgroundColor: bookingInfo?.background_color || 'inherit',
                        }}
                        onClick={(e) =>
                          handleCellClick(
                            villa.name,
                            day.day,
                            villa.id,
                            e,
                            bookingInfo.disabled,
                            bookingInfo.hold_status,
                            bookingInfo.is_booked
                          )
                        }
                        onContextMenu={(e) => handleCellClick(villa.name, day.day, villa.id, e)}
                      >
                        {isCellSelected(villa.name, day.day) && <div className="selected"></div>}
                        <div className="corner-number"                       style={{color:'rgb(0 0 0)',fontWeight:400,fontSize:14}}
                        >
                          {bookingInfo ? `${formattedAmount(bookingInfo.price)}` : 'N/A'}
                        </div>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      </Card>
     
      {/* <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}
      /> */}
      {/* Menu Ngữ Cảnh */}
      <Menu anchorEl={anchorEl} open={contextMenuOpen} onClose={handleContextMenuClose}>
        <MenuItem onClick={() => handleActionSelect('book')}>Đặt Chỗ</MenuItem>
        <MenuItem onClick={() => handleActionSelect('hold')}>Giữ Chỗ</MenuItem>
      </Menu>
      {/* Biểu Mẫu Đặt Chỗ Dialog */}
      {/* Booking Form Dialog */}
      {isBookingForm && (
        <BookingFormDialog
          fetchPriceQuotation={fetchPriceQuotation}
          isBookingForm={isBookingForm}
          setIsBookingForm={setIsBookingForm}
          selectedVillaName={selectedVillaName}
          priceQuotation={priceQuotation}
          customerList={customerList}
          startDate={startDate}
          endDate={endDate}
          selectionRange={selectionRange}
          handleBookingSubmit={onSubmitBooking}
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
