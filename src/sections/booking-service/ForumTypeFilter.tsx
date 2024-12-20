import { Button, Select, Paper, Grid, Snackbar, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useBooking } from "src/auth/context/service-context/BookingContext";
import axios from "axios";

interface IconOption {
    id: string;
    icon: string;
    name: string;
}
const API_BASE_URL = 'https://core-api.thehostie.com/amenities/icon';

export const fetchIcon = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching icons:', error);
        return [];
    }
};
// Validation Schema
const schema = yup.object().shape({
    selectedProvince: yup.string(),
    selectedAccommodationType: yup.string(),
    startDate1: yup.date().nullable(),
    endDate1: yup.date()
        .nullable()
        .test(
            "valid-range",
            "Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!",
            (endDate1, context) => {
                const startDate1 = context.parent.startDate1;
                if (!startDate1 || !endDate1) return true; // Allow null dates
                return endDate1 >= startDate1;
            }
        ),
    priceRange: yup.array()
        .of(yup.number().min(0, "Giá phải lớn hơn hoặc bằng 0"))
        .nullable(),
    iconFilter: yup.array().of(yup.number()).nullable(),

});

const ForumTypeFilter = ({ searchVisible, month, year, setClose, setMonth, setYears }: { setYears: any, setMonth: any, searchVisible: boolean; month: any; year: any; setClose: any; }) => {
    const { provinceList, fetchBookingData } = useBooking();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [icons, setIcons] = useState<IconOption[]>([]);

    useEffect(() => {
        const loadIcons = async () => {
            const data = await fetchIcon();
            setIcons(data);
        };
        loadIcons();
    }, []);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            selectedProvince: "",
            selectedAccommodationType: "",
            startDate1: null,
            endDate1: null,
            priceRange: [0, 100000000], // Default price range
            iconFilter: null, // Default value for icon filter
        },
    });

    const onSubmit = (data: any) => {
        const { selectedProvince, selectedAccommodationType, startDate1, endDate1, priceRange, iconFilter } = data;
        const [minPrice, maxPrice] = priceRange || [0, null];

        // Debug log the submitted data


        if (startDate1) {
            const month1 = startDate1.getMonth();
            const year1 = startDate1.getFullYear();
            setYears(year1);
            setMonth(month1 + 1);
        }

        fetchBookingData(1, year, month, selectedProvince, selectedAccommodationType, [startDate1, endDate1], maxPrice, minPrice, [iconFilter]);

        localStorage.setItem("searchParams", JSON.stringify(data));
        setSnackbarMessage("Tìm kiếm thành công!");
        setSnackbarOpen(true);
    };

    const handleClearFilters = () => {
        reset();
        localStorage.removeItem("searchParams");
        fetchBookingData(1, year, month);
        setClose(false);
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
                borderRadius: "8px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            }}
            aria-hidden={!searchVisible}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
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

                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Controller
                                    name="startDate1"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            label="Chọn ngày bắt đầu"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="endDate1"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            label="Chọn ngày kết thúc"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Price Range Slider */}
                    <Grid item xs={12} md={3}>
                        <Controller
                            name="priceRange"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    fullWidth
                                    {...field}
                                    displayEmpty
                                    renderValue={(value) => {
                                        if (!value || value.length === 0) return "Chọn khoảng giá";
                                        if (Array.isArray(value)) {
                                            const [min, max] = value;
                                            if (min === 0 && max === 100000) return "0 - 100k";
                                            if (min === 100000 && max === 400000) return "100k - 400k";
                                            if (min === 400000 && max === 700000) return "400k - 700k";
                                            if (min === 700000 && max === 1000000) return "700k - 1 triệu";
                                            if (min === 1000000 && max === 2000000) return "1 triệu - 2 triệu";
                                            if (min === 2000000 && max === 5000000) return "2 triệu - 5 triệu";
                                            if (min === 5000000 && max === 1000000000000000) return "5 triệu trở lên";
                                        }
                                        return "Chọn khoảng giá";
                                    }}
                                    aria-label="Chọn khoảng giá"
                                    style={{ minHeight: "40px" }}
                                >
                                    <MenuItem value="" disabled>
                                        Chọn khoảng giá
                                    </MenuItem>
                                    <MenuItem value={[0, 100000]}>0 - 100k</MenuItem>
                                    <MenuItem value={[100000, 400000]}>100k - 400k</MenuItem>
                                    <MenuItem value={[400000, 700000]}>400k - 700k</MenuItem>
                                    <MenuItem value={[700000, 1000000]}>700k - 1 triệu</MenuItem>
                                    <MenuItem value={[1000000, 2000000]}>1 triệu - 2 triệu</MenuItem>
                                    <MenuItem value={[2000000, 5000000]}>2 triệu - 5 triệu</MenuItem>
                                    <MenuItem value={[5000000, 1000000000000000]}>5 triệu trở lên</MenuItem>
                                </Select>
                            )}
                        />

                        {errors.priceRange && <p style={{ color: "red", marginTop: "4px" }}>{errors.priceRange.message}</p>}
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Controller
                            name="iconFilter"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    fullWidth
                                    {...field}
                                    multiple
                                    value={field.value || []}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (!selected || selected.length === 0) return "Chọn biểu tượng";
                                        const selectedIcons = icons.filter((icon) => selected.includes(icon.id));
                                        return selectedIcons.map((icon) => icon.name).join(", ");
                                    }}
                                    aria-label="Chọn biểu tượng"
                                    error={!!errors.iconFilter}
                                    style={{ minHeight: "40px" }}
                                >
                                    <MenuItem value="" disabled>
                                        Chọn biểu tượng
                                    </MenuItem>
                                    {icons.map((icon) => (
                                        <MenuItem key={icon.id} value={icon.id}>
                                            <img
                                                src={icon.icon}
                                                alt={icon.name}
                                                style={{ width: "24px", marginRight: "8px" }}
                                            />
                                            {icon.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.iconFilter && <p style={{ color: "red", marginTop: "4px" }}>{errors.iconFilter.message}</p>}
                    </Grid>


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
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClearFilters}
                            style={{ width: "100%", height: "40px" }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </Grid>
                </Grid>
            </form>

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
