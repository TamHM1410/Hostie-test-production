import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { format } from "date-fns";

// Validation schema
const validationSchema = Yup.object().shape({
    checkin: Yup.string().required("Vui lòng chọn ngày đến."),
    checkout: Yup.string()
        .required("Vui lòng chọn ngày rời đi.")
        .test(
            "is-after-checkin",
            "Ngày rời đi phải sau ngày đến.",
            (value, context) =>
                new Date(value || "") > new Date(context.parent.checkin || "")
        ),
});

const NativeDateInputForm = ({ residence_id, fetchPriceQuotation, openDatePicker, setOpenDatePicker, handleNext, setStartDate, setEndDate }: { residence_id: any, fetchPriceQuotation: any, setStartDate: any, setEndDate: any, openDatePicker: any, setOpenDatePicker: any, handleNext: any }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            checkin: "",
            checkout: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: any) => {
        // Convert the date format to dd-MM-yyyy
        const formattedCheckin = format(new Date(data?.checkin), "dd-MM-yyyy");
        const formattedCheckout = format(new Date(data?.checkout), "dd-MM-yyyy");

        setStartDate(formattedCheckin);
        setEndDate(formattedCheckout);

        await fetchPriceQuotation(formattedCheckin, formattedCheckout, residence_id)
        handleNext();
    };
    return (
        <Dialog open={openDatePicker} onClose={() => setOpenDatePicker(false)}>
            <DialogTitle>Chọn ngày</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    padding: 3,

                }}
            >
                {/* Native Date Input for Checkin */}
                <Controller
                    name="checkin"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}

                            type="date"
                            label="Ngày đến"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.checkin}
                            helperText={errors.checkin?.message}
                            fullWidth
                            sx={{ marginTop: 2 }}
                        />
                    )}
                />

                {/* Native Date Input for Checkout */}
                <Controller
                    name="checkout"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="date"
                            label="Ngày rời đi"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.checkout}
                            helperText={errors.checkout?.message}
                            fullWidth
                            sx={{ marginTop: 2 }}
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDatePicker(false)} color="secondary">
                    Hủy
                </Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
                    Tiếp theo
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NativeDateInputForm; 