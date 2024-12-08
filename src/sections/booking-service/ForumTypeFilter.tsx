import { Button, Select, Paper, Grid, Snackbar, TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Ensure @mui/x-date-pickers is installed
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useBooking } from "src/auth/context/service-context/BookingContext";

// Validation Schema
const schema = yup.object().shape({
    selectedProvince: yup.string(),
    selectedAccommodationType: yup.string(),
    startDate1: yup.date().nullable(),
    endDate1: yup.date()
        .nullable()
        .test("valid-range", "Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!", (endDate1, context) => {
            const startDate1 = context.parent.startDate1;
            if (!startDate1 || !endDate1) return true; // Allow null dates
            return endDate1 >= startDate1;
        })
    ,
    maxPrice: yup.string().nullable().min(0, "Giá tối đa không được nhỏ hơn 0."),
    minPrice: yup.string().nullable().min(0, "Giá tối thiểu không được nhỏ hơn 0."),
});

const ForumTypeFilter = ({ searchVisible, month, year, setClose, setMonth, setYears }: { setYears: any, setMonth: any, searchVisible: boolean; month: any; year: any; setClose: any; }) => {
    const { provinceList, fetchBookingData } = useBooking();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // React Hook Form setup
    const {
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            selectedProvince: "",
            selectedAccommodationType: "",
            startDate1: null,
            endDate1: null,
            maxPrice: 0,
            minPrice: 0,
        },
    });

    const onSubmit = (data: any) => {
        const { selectedProvince, selectedAccommodationType, startDate1, endDate1, maxPrice, minPrice } = data;

        // Format dates if selected
        if (startDate1) {
            // Trích xuất tháng từ đối tượng Date
            const month1 = startDate1.getMonth(); // Tháng được tính từ 0 (0 = Tháng 1, 11 = Tháng 12)

            const year1 = startDate1.getFullYear()
            setYears(year1)
            console.log(year1);

            const formattedMonth = String(month1 + 1).padStart(2, '0'); // Thêm '0' nếu chỉ có một chữ số

            // Tạo một đối tượng Date mới và đặt tháng
            const newDate = new Date();
            setMonth(month1 + 1); // Đặt tháng theo giá trị đã lấy từ startDate1

        }
        // Fetch booking data
        fetchBookingData(1, year, month, selectedProvince, selectedAccommodationType, [startDate1, endDate1], maxPrice, minPrice);

        // Store search parameters in localStorage
        localStorage.setItem("searchParams", JSON.stringify(data));

        // Show success message in snackbar
        setSnackbarMessage("Tìm kiếm thành công!");
        setSnackbarOpen(true);
    };

    const handleClearFilters = () => {
        reset(); // Reset form fields
        localStorage.removeItem("searchParams"); // Remove stored search params
        fetchBookingData(1, year, month); // Fetch data with default filters

        // Close the filter panel
        setClose(false);

        // Optionally show snackbar
        setSnackbarMessage("Bộ lọc đã được xóa!");
        setSnackbarOpen(true);
    };

    return (
        <Paper
            style={{
                display: searchVisible ? "block" : "none",
                opacity: searchVisible ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
                padding: "16px",
                borderRadius: "8px", // Rounded corners for Paper
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Slight shadow
            }}
            aria-hidden={!searchVisible}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    {/* Province Selection */}
                    <Grid item xs={12} md={3}>
                        <Controller
                            name="selectedProvince"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    fullWidth
                                    {...field}
                                    displayEmpty
                                    renderValue={(value) => {
                                        const selectedProvince = provinceList?.find((pro: any) => pro.code === value);
                                        return selectedProvince ? selectedProvince.name : "Chọn tỉnh";
                                    }}
                                    aria-label="Chọn tỉnh"
                                    error={!!errors.selectedProvince}
                                    style={{ minHeight: "40px" }}
                                >
                                    <MenuItem value="" disabled>
                                        Chọn tỉnh
                                    </MenuItem>
                                    {provinceList?.map((province: any) => (
                                        <MenuItem key={province.code} value={province.code}>
                                            {province.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.selectedProvince && <p style={{ color: "red", marginTop: "4px" }}>{errors.selectedProvince.message}</p>}
                    </Grid>

                    {/* Accommodation Type Selection */}
                    <Grid item xs={12} md={3}>
                        <Controller
                            name="selectedAccommodationType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    fullWidth
                                    {...field}
                                    displayEmpty
                                    renderValue={(value) =>
                                        value === "1" ? "Villa" : value === "2" ? "Homestay" : "Chọn loại chỗ ở"
                                    }
                                    aria-label="Chọn loại chỗ ở"
                                    error={!!errors.selectedAccommodationType}
                                    style={{ minHeight: "40px" }}
                                >
                                    <MenuItem value="" disabled>
                                        Chọn loại chỗ ở
                                    </MenuItem>
                                    <MenuItem value="1">Villa</MenuItem>
                                    <MenuItem value="2">Homestay</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.selectedAccommodationType && (
                            <p style={{ color: "red", marginTop: "4px" }}>{errors.selectedAccommodationType.message}</p>
                        )}
                    </Grid>

                    {/* Date Range Selection */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            {/* Start Date */}
                            <Grid item xs={6}>
                                <Controller
                                    name="startDate1"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            label="Chọn ngày bắt đầu"
                                            renderInput={(props) => <TextField {...props} fullWidth />}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* End Date */}
                            <Grid item xs={6}>
                                <Controller
                                    name="endDate1"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            label="Chọn ngày kết thúc"
                                            renderInput={(props) => <TextField {...props} fullWidth />}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        {errors.startDate1 && <p style={{ color: "red", marginTop: "4px" }}>{errors.startDate1.message}</p>}
                        {errors.endDate1 && <p style={{ color: "red", marginTop: "4px" }}>{errors.endDate1.message}</p>}
                    </Grid>

                    {/* Price Inputs */}
                    <Grid item xs={12} md={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Controller
                                    name="minPrice"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            type="number"
                                            {...field}
                                            label="Giá tối thiểu"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                        />
                                    )}
                                />
                                {errors.minPrice && <p style={{ color: "red", marginTop: "4px" }}>{errors.minPrice.message}</p>}
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="maxPrice"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            type="number"
                                            {...field}
                                            label="Giá tối đa"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                        />
                                    )}
                                />
                                {errors.maxPrice && <p style={{ color: "red", marginTop: "4px" }}>{errors.maxPrice.message}</p>}
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12} md={4} sx={{ display: "flex", gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{
                                background: "linear-gradient(to right, #2152FF, #21D4FD)",
                                color: "white",
                                width: "100%",
                                height: "40px",
                            }}
                            aria-label="Tìm kiếm"
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClearFilters}
                            style={{ width: "100%", height: "40px" }}
                            aria-label="Xóa bộ lọc"
                        >
                            Xóa bộ lọc
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Snackbar for success messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Paper>
    );
};

export default ForumTypeFilter;
