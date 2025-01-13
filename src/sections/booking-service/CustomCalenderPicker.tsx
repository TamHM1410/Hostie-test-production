import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip, TextField } from '@mui/material';
import { DateRangePicker } from 'mui-daterange-picker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { vi } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useCurrentDate } from 'src/zustand/pickDate';

const formatMonth = (date) => {
  if (!date) return '';

  const month =  String(new Date(date).getMonth() + 1).padStart(2, '0')
  return month;
};

const formatDateRange = (from, to) => {
  if (!from || !to) return '';
  return `Từ ${from}  đến ${to}`;
};

const CustomCalendarPicker = () => {
  // Local state
  const [anchorEl, setAnchorEl] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Global state from Zustand
  const { updateMonth, typeOfDate, updateRangeDate, rangeDate, monthRange } = useCurrentDate();

  // Handlers
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangeChange = useCallback(
    (range) => {
      if (!range?.startDate || !range?.endDate) return;

      const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      };
      const formatMonth = (date) => {
        const d = new Date(date);
        const month = d.getMonth() + 1;
        return month;
      };

      const getMonthRange = (startMonth, endMonth) => {
        const months = [];

        if (startMonth <= endMonth) {
          for (let month = startMonth; month <= endMonth; month++) {
            months.push(month);
          }
        } else {
          for (let month = startMonth; month <= 12; month++) {
            months.push(month);
          }
          for (let month = 1; month <= endMonth; month++) {
            months.push(month);
          }
        }

        return months;
      };

      const from = formatDate(range.startDate);
      const to = formatDate(range.endDate);

      const startMonth = formatMonth(range.startDate);
      const endMonth = formatMonth(range.endDate);

      if (startMonth !== endMonth) {
        const a = getMonthRange(
          startMonth.toString().padStart(2, '0'),
          endMonth.toString().padStart(2, '0')
        );
        updateRangeDate(from, to, a);
        return;
      }


      updateRangeDate(from, to, [formatMonth(range.startDate),formatMonth(range.endDate)]);
    },
    [updateRangeDate]
  );

  const handleMonthChange = useCallback(
    (date) => {
      if (!date) return;
      setSelectedDate(date);
      updateMonth(formatMonth(date));
      setPickerOpen(false);
    },
    [updateMonth]
  );

  const displayValue =
    typeOfDate === 'month'
      ? `Tháng ${formatMonth(selectedDate)}`
      : formatDateRange(rangeDate.from, rangeDate.to);

  return (
    <Box sx={{ p: 3, pt: 3.2, position: 'relative' }}>
      <TextField
        label={typeOfDate === 'month' ? 'Tháng' : 'Khoảng thời gian'}
        value={displayValue}
        onClick={() => setPickerOpen(true)}
        sx={{ width: '100%' }}
        InputProps={{ readOnly: true }}
        fullWidth
      />

      <Tooltip title="Chọn theo khoảng thời gian">
        <IconButton onClick={handleMenuClick}>
          <CalendarTodayIcon />
        </IconButton>
      </Tooltip>

      {/* Date Range Picker */}
      {anchorEl && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            mt: 1,
            boxShadow: 3,
          }}
        >
          <DateRangePicker
            open={Boolean(anchorEl)}
            toggle={handleMenuClose}
            onChange={handleDateRangeChange}
            locale={vi}
            definedRanges={[]}
          />
        </Box>
      )}

      {/* Month Picker */}
      <DatePicker
        label="Month"
        openTo="month"
        views={['month']}
        value={selectedDate}
        onChange={handleMonthChange}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        sx={{ visibility: 'hidden' }}
      />
    </Box>
  );
};

export default CustomCalendarPicker;
