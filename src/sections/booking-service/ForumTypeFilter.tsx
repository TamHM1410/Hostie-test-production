import { Button, Select, Paper, Grid, Snackbar, TextField, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Ensure @mui/x-date-pickers is installed
import { useState } from "react";

const ForumTypeFilter = ({ searchVisible }: { searchVisible: boolean }) => {
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleSearchClick = () => {
        setSnackbarMessage(`Searching with: Brand - ${selectedBrand}, Accommodation - ${selectedAccommodation}, Dates - ${dateRange}`);
        setSnackbarOpen(true);
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
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md={3}>
                    <Select
                        fullWidth
                        value={selectedBrand}
                        onChange={(event) => setSelectedBrand(event.target.value)}
                        displayEmpty
                        renderValue={(value) => (value || "Chọn thương hiệu")}
                        aria-label="Chọn thương hiệu" // Add ARIA label
                    >
                        <MenuItem value="" disabled>Chọn thương hiệu</MenuItem>
                        <MenuItem value="brand1">Thương Hiệu 1</MenuItem>
                        <MenuItem value="brand2">Thương Hiệu 2</MenuItem>
                        <MenuItem value="brand3">Thương Hiệu 3</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Select
                        fullWidth
                        value={selectedAccommodation}
                        onChange={(event) => setSelectedAccommodation(event.target.value)}
                        displayEmpty
                        renderValue={(value) => (value || "Chọn loại chỗ ở")}
                        aria-label="Chọn loại chỗ ở" // Add ARIA label
                    >
                        <MenuItem value="" disabled>Chọn loại chỗ ở</MenuItem>
                        <MenuItem value="accommodation1">Loại chỗ ở 1</MenuItem>
                        <MenuItem value="accommodation2">Loại chỗ ở 2</MenuItem>
                        <MenuItem value="accommodation3">Loại chỗ ở 3</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={6}>
                            <DatePicker
                                value={dateRange[0]}
                                onChange={(newValue:any) => setDateRange([newValue, dateRange[1]])}
                                label="Chọn ngày bắt đầu"
                                components={{

                                    TextField: (props:any) => <TextField {...props} fullWidth />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                value={dateRange[1]}
                                onChange={(newValue:any) => setDateRange([dateRange[0], newValue])}
                                label="Chọn ngày kết thúc"
                                components={{

                                    TextField: (props:any) => <TextField {...props} fullWidth />,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={1}>
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
                </Grid>
            </Grid>

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
