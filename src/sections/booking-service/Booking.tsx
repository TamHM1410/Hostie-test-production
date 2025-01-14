'use client';
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
import { useCurrentDate } from 'src/zustand/pickDate';

import HoldingFormDialog from './HoldingForm';
import BookingFormDialog from './BookingDialogForm';
import toast from 'react-hot-toast';
import Card from '@mui/material/Card';

import BookingTableCalendar from './BookingTableCalendar';

const parseDate = (dateString: any) => {
  const [day, month, year] = dateString.split('-').map(Number); // Tách chuỗi và chuyển đổi thành số
  return new Date(year, month - 1, day); // Tạo đối tượng Date (lưu ý: tháng bắt đầu từ 0)
};

const getDaysInRange = (startDate: any, endDate: any) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const daysArray = [];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']; // Chuỗi tên các ngày
  let index = 0; // Khởi tạo biến index

  while (start <= end) {
    daysArray.push({
      index: index++, // Gán index và tăng giá trị

      day: start.getDate(),
      month: start.getMonth() + 1, // Lấy tháng (thêm 1 vì getMonth trả giá trị từ 0-11)
      year: start.getFullYear(),
      dayOfWeek: dayNames[start.getDay()], // Tên ngày trong tuần
    });
    start.setDate(start.getDate() + 1); // Tăng ngày lên 1
  }

  return daysArray;
};
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
    mapUsersOnline
  } = useBooking() as any;

  const { typeOfDate, rangeDate, month, pageSize, monthRange } = useCurrentDate();

  // const [selectedMonth, setSelectedMonth] = useState(month);
  const [daysInMonth, setDaysInMonth] = useState<{ day: number; dayOfWeek: string }[]>([]);
  // Trạng thái mới để theo dõi khoảng chọn

  const [selectionRange, setSelectionRange] = useState<{
    villaName: string;
    start: number;
    end: number;
    residence_id: string;
    month: any;
    startIndex: any;
    endIndex: any;
  } | null>(null);

  const { data: session } = useSession();

  const user_name: any = session?.user?.id;

  // Trạng thái cho menu ngữ cảnh
  const [isLoading, setIsLoading] = useState(false);

  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionType, setActionType] = useState<'book' | 'hold' | null>(null);


  // Trạng thái cho biểu mẫu đặt chỗ và giữ chỗ
  const [startDate, setStartDate] = useState<string>('');

  const [endDate, setEndDate] = useState<string>('');

  const [startMonth,setStartMonth] = useState<string>('');
  const [endMonth,setEndMonth] = useState<string>('');

  // cờ để chuyển đổi tính năng của biểu mẫu

  const [isBookingForm, setIsBookingForm] = useState(false);
  const [isHoldingForm, setIsHoldingForm] = useState(false);

  // message

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedVillaName, setSelectedVillaName] = useState('');
   


  const handleCellClick = (
    villaName: string,
    day: number,
    residence_id: string,
    event: React.MouseEvent<HTMLTableCellElement>,
    disable?: boolean,
    holdStatus?: number,
    isBook?: boolean,
    month: any,
    index: any
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
        setSelectionRange({
          villaName,
          start: day,
          end: day,
          residence_id,
          month,
          startIndex: index,
          endIndex: index,
        });
        setSelectedVillaName(villaName);
      } else if (selectionRange.villaName === villaName) {
        // Extend or shrink the range
        const newStartIndex = Math.min(selectionRange.startIndex, index);
        const newEndIndex = Math.max(selectionRange.endIndex, index);
        let newStart=selectionRange.start;
        let newEnd=selectionRange.end;


        if(startMonth===''){
          setStartMonth(month)

        }
        
        if(newStartIndex!==selectionRange.startIndex){
          newStart=day
          setStartMonth(month)
          if(endMonth===''){
            setEndMonth(month)

          }
        }

        if(newEndIndex!==selectionRange.endIndex){
          newEnd=day
          setEndMonth(month)
        }

        // const newStart = Math.min(selectionRange.start, day);
        // const newEnd = Math.max(selectionRange.end, day);
        
        if (selectionRange.start === day && selectionRange.end === day) {
          // Reset if clicking the same cell
          setSelectionRange(null);
          setSelectedVillaName('');
        } else {
          if (checkSelectedDays(newStart, newEnd)) {
            return; // Stop the execution if the selection range is invalid
          }
          setSelectionRange({
            villaName,
            start: newStart,
            end: newEnd,
            residence_id,
            month,
            startIndex: newStartIndex,
            endIndex: newEndIndex,
          });
        }
      } else {
        // Start a new range for a different villa
        setSelectionRange({
          villaName,
          start: day,
          end: day,
          residence_id,
          month,
          startIndex: index,
          endIndex: index,
        });
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
        day >= Math.min(selectionRange.startIndex, selectionRange.endIndex) &&
        day <= Math.max(selectionRange.startIndex, selectionRange.endIndex)
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
        typeOfDate==='month' ? month : startMonth.toString().padStart(2, '0')

      }-${year}`,
      `${String(selectionRange?.end).padStart(2, '0')}-${
        typeOfDate==='month' ? month : endMonth.toString().padStart(2, '0')
      }-${year}`,
      parseInt(selectionRange?.residence_id)
    );
    setActionType(action);
    setStartDate(
      `${String(selectionRange?.start).padStart(2, '0')}-${
        typeOfDate==='month' ? month :startMonth.toString().padStart(2, '0')
      }-${year}`
    );

    setEndDate(
      `${String(selectionRange?.end).padStart(2, '0')}-${
        typeOfDate==='month' ? month : endMonth.toString().padStart(2, '0')
      }-${year}`
    );
    handleContextMenuClose();

    if (action === 'book') {
      if (!customerList?.data?.length) {
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
    const savedParams = localStorage.getItem('searchParams');
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
    // Close the dialog after successful submission
    setIsHoldingForm(false);
  };
  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(!isLoading);

    try {
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedParams = localStorage.getItem('searchParams');

      if (savedParams) {
        const parsedParams = JSON.parse(savedParams);
        const {
          selectedProvince,
          selectedAccommodationType,
          startDate1,
          endDate1,
          priceRange,
          iconFilter,
        } = parsedParams;

        const minPrice = priceRange?.[0];
        const maxPrice = priceRange?.[1];

        // Create a ref to track if the component is mounted
        let isMounted = true;

        // Only fetch if we have the required data
        if (typeOfDate === 'month' && month) {
          fetchBookingData(
            currentPage,
            year,
            month,
            selectedProvince,
            selectedAccommodationType,
            [startDate1, endDate1],
            maxPrice,
            minPrice,
            iconFilter
          );
        } else if (typeOfDate === 'range' && rangeDate.from && rangeDate.to) {
          fetchBookingData(
            currentPage,
            year,
            month,
            selectedProvince,
            selectedAccommodationType,
            [startDate1, endDate1],
            maxPrice,
            minPrice,
            iconFilter
          );
        }

        return () => {
          isMounted = false;
        };
      } else {
        fetchBookingData(currentPage, year, month);
      }
    }

    fetchListCustomer();
  }, [month, typeOfDate, rangeDate.from, rangeDate.to, pageSize]); // Track specific values

  useEffect(() => {
    if (typeOfDate === 'month') {
      const daysInCurrentMonth = new Date(year, month, 0).getDate();
      const daysArray = Array.from({ length: daysInCurrentMonth }, (_, i) => {
        const date = new Date(year, month - 1, i + 1);
        return {
          day: i + 1,
          dayOfWeek: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][(date.getUTCDay() + 7) % 7],
          index: i,
          month: month,
        };
      });
      setDaysInMonth(daysArray);
      return;
    }

    const daysArray = getDaysInRange(rangeDate.from, rangeDate.to);
    setDaysInMonth(daysArray);
  }, [month, year, typeOfDate, rangeDate.from, rangeDate.to]);

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
      <Card sx={{ width: '100%', maxHeight: 1200 }}>
        <BookingTableCalendar
          bookingData={bookingData}
          daysInMonth={daysInMonth}
          selectedMonth={selectedMonth}
          user_name={user_name}
          setSelectedMonth={setSelectedMonth}
          fetchResidenceInfor={fetchResidenceInfor}
          fetchPolicy={fetchPolicy}
          fetchImages={fetchImages}
          isCellSelected={isCellSelected}
          year={year}
          handleCellClick={handleCellClick}
          isLoading={isLoading}
          onLoadMore={loadMore}
          mapUsersOnline={mapUsersOnline}
        />
      </Card>
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
