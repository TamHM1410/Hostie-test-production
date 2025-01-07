'use client'
import React, { useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Divider,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    DialogActions,
    Button,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DatePicker } from '@mui/x-date-pickers';
import toast from 'react-hot-toast';

const validationSchema = Yup.object().shape({
    default_price: Yup.number()
        .required('Giá mặc định là bắt buộc')
        .positive('Giá phải là số dương'),
    weekend_price: Yup.array()
        .of(
            Yup.object().shape({
                weeknd_day: Yup.number().required('Vui lòng chọn ngày cuối tuần'),
                price: Yup.number()
                    .required('Giá mới là bắt buộc')
                    .min(1, 'Giá phải lớn hơn 0'),
            })
        )
        .max(2, 'Không thể thêm quá 2 mục giá cuối tuần'),
    season_price: Yup.array().of(
        Yup.object().shape({
            start_date: Yup.date()
                .nullable()
                .required('Ngày bắt đầu là bắt buộc'),
            end_date: Yup.date()
                .nullable()
                .required('Ngày kết thúc là bắt buộc')
                .min(
                    Yup.ref('start_date'),
                    'Ngày kết thúc phải lớn hơn ngày bắt đầu'
                )
                .max(
                    new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    'Ngày kết thúc không được vượt quá 1 năm kể từ ngày hiện tại'
                ),
            price: Yup.number()
                .required('Giá mới là bắt buộc')
                .min(1, 'Giá phải lớn hơn 0'),
            description: Yup.string(),
        })
    ),
});

interface SeasonEntry {
    start_date: Date | null;
    end_date: Date | null;
    price?: number;
    description: string;
}

interface WeekendEntry {
    weeknd_day: number;
    price?: number;
}

interface FormData {
    default_price: number;
    weekend_price: WeekendEntry[];
    season_price: SeasonEntry[];
}

interface Step3Props {
    onSubmit: (data: FormData) => void;

    dataPrices: any
}

export default function UpdateStep4({ onSubmit, dataPrices }: Step3Props) {



    const defaultValues: FormData = {
        default_price: 1000,
        weekend_price: [{ weeknd_day: 6, price: 100 }],
        season_price: [
            {
                start_date: new Date(2024, 10, 20),
                end_date: new Date(2024, 10, 21),
                price: 100,
                description: 'Ngày Lễ 20/11',
            },
        ],
    };

    // Chuẩn bị giá trị khởi tạo dựa trên dataPrices hoặc defaultValues
    const initialValues =
    {
        ...dataPrices,
        season_price: dataPrices?.season_price?.map((entry) => ({
            ...entry,
            start_date: entry.start_date ? new Date(entry.start_date) : null,
            end_date: entry.end_date ? new Date(entry.end_date) : null,
        })),
    }


    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: dataPrices?.default_price === 0 ? defaultValues : initialValues
    });

    const weekend_price = watch('weekend_price');
    const season_price = watch('season_price');
    const selectedWeekends = new Set(weekend_price?.map((entry) => entry.weeknd_day));

    // useEffect(() => {

    //     if (dataPrices) {

    //         const formattedData: FormData = {
    //             ...dataPrices,
    //             season_price: dataPrices?.season_price?.map((entry) => ({
    //                 ...entry,
    //                 start_date: entry.start_date ? new Date(entry.start_date) : null,
    //                 end_date: entry.end_date ? new Date(entry.end_date) : null,
    //             })),
    //         };
    //         Object.entries(formattedData).forEach(([key, value]) =>
    //             setValue(key as keyof FormData, value)
    //         );
    //     }
    // }, [setValue]);

    const handleFormSubmit = (data: FormData) => {
        onSubmit(data);
    };

    const addWeekendEntry = () => {
        if (weekend_price?.length < 2) {
            setValue('weekend_price', [...weekend_price, { weeknd_day: 0, price: 0 }]);
        }

    };

    const removeWeekendEntry = (index: number) => {
        setValue(
            'weekend_price',
            weekend_price.filter((_, i) => i !== index)
        );
    };

    const addSeasonEntry = () => {

        setValue('season_price', [
            ...season_price,
            { start_date: null, end_date: null, price: 0, description: '' },
        ]);

    };

    const removeSeasonEntry = (index: number) => {
        setValue(
            'season_price',
            season_price.filter((_, i) => i !== index)
        );
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            autoComplete="off"
            sx={{ maxWidth: 600, mx: 'auto', p: 2 }}
        >
            <TextField
                label="Giá mặc định"
                variant="outlined"
                fullWidth
                type="number"
                {...register('default_price')}
                error={!!errors.default_price}
                helperText={errors.default_price?.message}
                margin="normal"
                InputProps={{
                    endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                }}
            />

            {/* Weekend Entries */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
                Giá cuối tuần
            </Typography>
            {weekend_price?.map((entry, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Ngày cuối tuần</InputLabel>
                        <Select
                            label="Ngày cuối tuần"
                            value={entry.weeknd_day || ''}
                            onChange={(e) => {
                                const updatedEntries = [...weekend_price];
                                updatedEntries[index].weeknd_day = Number(e.target.value);
                                setValue('weekend_price', updatedEntries);
                            }}
                            error={!!errors?.weekend_price?.[index]?.weeknd_day}
                        >
                            <MenuItem value={6} disabled={selectedWeekends.has(6)}>
                                Thứ 6
                            </MenuItem>
                            <MenuItem value={7} disabled={selectedWeekends.has(7)}>
                                Thứ 7
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Giá mới"
                        variant="outlined"
                        type="number"
                        {...register(`weekend_price.${index}.price`)}
                        error={!!errors?.weekend_price?.[index]?.price}
                        helperText={errors?.weekend_price?.[index]?.price?.message}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                        }}
                    />
                    <IconButton onClick={() => removeWeekendEntry(index)} color="error">
                        <RemoveIcon />
                    </IconButton>
                </Box>
            ))}
            <IconButton onClick={addWeekendEntry} color="primary">
                <AddIcon />
            </IconButton>

            {/* Season Entries */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
                Giá theo mùa
            </Typography>
            {season_price?.map((entry, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                    }}
                >
                    <Controller
                        control={control}
                        name={`season_price.${index}.start_date`}
                        render={({ field }) => (
                            <>
                                <DatePicker
                                    {...field}
                                    label="Ngày bắt đầu"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={!!errors.season_price?.[index]?.start_date}
                                            helperText={errors.season_price?.[index]?.start_date?.message || ''}
                                        />
                                    )}
                                    onChange={(date) => field.onChange(date)}
                                />
                                {!!errors.season_price?.[index]?.start_date && (
                                    <Typography color="error" variant="caption">
                                        {errors.season_price?.[index]?.start_date?.message}
                                    </Typography>
                                )}
                            </>

                        )}
                    />
                    <Controller
                        control={control}
                        name={`season_price.${index}.end_date`}
                        render={({ field }) => (
                            <>
                                <DatePicker
                                    {...field}
                                    label="Ngày kết thúc"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={!!errors.season_price?.[index]?.end_date}
                                            helperText={errors.season_price?.[index]?.end_date?.message || ''}
                                        />
                                    )}
                                    onChange={(date) => field.onChange(date)}

                                />

                                {!!errors.season_price?.[index]?.end_date && (
                                    <Typography color="error" variant="caption">
                                        {errors.season_price?.[index]?.end_date?.message}
                                    </Typography>
                                )}
                            </>

                        )}
                    />
                    <TextField
                        label="Giá mới"
                        variant="outlined"
                        type="number"
                        {...register(`season_price.${index}.price`)}
                        error={!!errors.season_price?.[index]?.price}
                        helperText={errors.season_price?.[index]?.price?.message}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                        }}
                    />
                    <IconButton onClick={() => removeSeasonEntry(index)} color="error">
                        <RemoveIcon />
                    </IconButton>
                </Box>
            ))}
            <IconButton onClick={addSeasonEntry} color="primary">
                <AddIcon />
            </IconButton>
            <Divider sx={{ my: 3 }} />
            {/* Actions */}
            <DialogActions >
                <Button type="submit" variant="contained" color="primary">
                    Cập nhật
                </Button>
            </DialogActions>
        </Box>
    );
}