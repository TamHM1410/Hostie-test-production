import { Button, Select, Paper, Grid, Snackbar, TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Ensure @mui/x-date-pickers is installed
import { useState } from "react";
import { useBooking } from "src/auth/context/service-context/BookingContext";

const ForumTypeFilter = ({ searchVisible, month, year, setClose }: { searchVisible: boolean, month: any, year: any, setClose: any }) => {
    const [selectedProvince, setSelectedProvince] = useState<string | null>('');
    const [selectedAccommodationType, setSelectedAccommodationType] = useState<string | null>('');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [maxPrice, setMaxPrice] = useState<number | null>(null); // max price state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { provinceList, fetchBookingData } = useBooking()

    const handleClearFilters = () => {
        setSelectedProvince('');
        setSelectedAccommodationType('');
        setDateRange([null, null]);
        setMaxPrice(null);
        localStorage.removeItem('searchParams');
        setClose(false)
        fetchBookingData(1, '2024', '11', selectedProvince, selectedAccommodationType, dateRange, maxPrice)

    };

    const handleSearchClick = () => {
        setSnackbarMessage(`Searching with: Province - ${selectedProvince}, Accommodation Type - ${selectedAccommodationType}, Dates - ${dateRange}, Max Price - ${maxPrice}`);


        // Constructing the API query based on user selections
        const formattedCheckinDate = dateRange[0] ? dateRange[0].toLocaleDateString('en-GB') : '';
        const formattedCheckoutDate = dateRange[1] ? dateRange[1].toLocaleDateString('en-GB') : '';

        const apiQuery = `?page_size=7&page=1&month=2024-11&checkin=${formattedCheckinDate}&checkout=${formattedCheckoutDate}&type=${selectedAccommodationType}&province_id=${selectedProvince}&max_prices=${maxPrice}`;
        console.log("API Query:", apiQuery);

        const searchParams = {
            selectedProvince,
            selectedAccommodationType,
            dateRange,
            maxPrice
        };
        localStorage.setItem('searchParams', JSON.stringify(searchParams));

        fetchBookingData(1, '2024', '11', selectedProvince, selectedAccommodationType, dateRange, maxPrice)
        // Perform API request here (using fetch/axios)
    };


    const handleDateChange = (newStartDate: Date | null, newEndDate: Date | null) => {
        if (newStartDate && newEndDate && newEndDate < newStartDate) {
            // If end date is before start date, reset end date and show message
            setSnackbarMessage('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!');
            setSnackbarOpen(true);
            setDateRange([newStartDate, null]); // Reset end date
        } else {
            setDateRange([newStartDate, newEndDate]); // Otherwise, update the date range
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Paper
            style={{
                display: searchVisible ? 'block' : 'none',
                opacity: searchVisible ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                padding: '16px',
            }}
            aria-hidden={!searchVisible}
        >
            <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                {/* Province Selection */}
                <Grid item xs={12} md={2}>
                    <Select
                        fullWidth
                        value={selectedProvince || ""}
                        onChange={(event) => setSelectedProvince(event.target.value)}
                        displayEmpty
                        renderValue={(value) => {
                            // Find the province object based on the value (province code)
                            const selectedProvince1 = provinceList?.find((pro: any) => pro.code === value);
                            return selectedProvince1 ? selectedProvince1.name : "Chọn tỉnh"; // Show the name or default text if no province is selected
                        }}
                        aria-label="Chọn tỉnh"
                    >
                        <MenuItem value="" disabled>Chọn tỉnh</MenuItem>
                        {provinceList?.map((province: any) => (
                            <MenuItem key={province.code} value={province.code}>
                                {province.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

                {/* Accommodation Type Selection */}
                <Grid item xs={12} md={2}>
                    <Select
                        fullWidth
                        value={selectedAccommodationType || ""}
                        onChange={(event) => setSelectedAccommodationType(event.target.value)}
                        displayEmpty
                        renderValue={(value) => {
                            // If a value is selected, return the corresponding name
                            return value === 1 ? "Villa" : value === 2 ? "Homestay" : "Chọn loại chỗ ở";
                        }}
                        aria-label="Chọn loại chỗ ở"
                    >
                        <MenuItem value="" disabled>Chọn loại chỗ ở</MenuItem>
                        <MenuItem value={1}>Villa</MenuItem>
                        <MenuItem value={2}>Homestay</MenuItem>
                    </Select>
                </Grid>

                {/* Date Range Selection */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={6}>
                            <DatePicker
                                value={dateRange[0]}
                                onChange={(newStartDate: any) => handleDateChange(newStartDate, dateRange[1])}
                                label="Chọn ngày bắt đầu"
                                components={{
                                    TextField: (props: any) => <TextField {...props} fullWidth />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                value={dateRange[1]}
                                onChange={(newEndDate: any) => handleDateChange(dateRange[0], newEndDate)}
                                label="Chọn ngày kết thúc"
                                components={{
                                    TextField: (props: any) => <TextField {...props} fullWidth />,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Max Price Input */}
                {/* <Grid item xs={12} md={1}>
                    <TextField
                        fullWidth
                        type="number"
                        value={maxPrice || ''}
                        onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)}
                        label="Giá tối đa"
                        InputProps={{
                            inputProps: { min: 0 },
                        }}
                    />
                </Grid> */}

                {/* Search Button */}
                <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleSearchClick}
                        style={{
                            background: "linear-gradient(to right, #2152FF, #21D4FD)",
                            color: 'white',
                            width: '100%',
                        }}
                        aria-label="Tìm kiếm"
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                        style={{
                            background: "linear-gradient(to right, #FF4F77, #FF6F91)",
                            color: 'white',
                            width: '100%',
                        }}
                        aria-label="Xóa bộ lọc"
                    >
                        Xóa bộ lọc
                    </Button>
                </Grid>

            </Grid>

            {/* Snackbar to show selected filter */}
            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Set the position
            />
        </Paper>
    );
};

export default ForumTypeFilter;  
