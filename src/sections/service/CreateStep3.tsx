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
import { NumericFormat } from 'react-number-format';

const validationSchema = Yup.object().shape({
  defaultPrice: Yup.number().required('Giá mặc định là bắt buộc').positive('Giá phải là số dương'),
  weekendEntries: Yup.array()
    .of(
      Yup.object().shape({
        weekendFee: Yup.number().required('Vui lòng chọn ngày cuối tuần'),
        weekendSurcharge: Yup.number().nullable().positive('Giá mới phải lớn hơn 0 '),
      })
    )
    .max(2, 'Không thể thêm quá 2 mục giá cuối tuần'),
  seasonEntries: Yup.array().of(
    Yup.object().shape({
      seasonFrom: Yup.date().nullable().required('Ngày bắt đầu là bắt buộc'),
      seasonTo: Yup.date()
        .nullable()
        .required('Ngày kết thúc là bắt buộc')
        .min(Yup.ref('seasonFrom'), 'Ngày kết thúc phải lớn hơn ngày bắt đầu')
        .max(
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          'Ngày kết thúc không được vượt quá 1 năm kể từ ngày hiện tại'
        ),
      seasonSurcharge: Yup.number().nullable().positive('Giá mới phải là số dương'),
      seasonDescription: Yup.string(),
    })
  ),
});

interface SeasonEntry {
  seasonFrom: Date | null;
  seasonTo: Date | null;
  seasonSurcharge?: number;
  seasonDescription: string;
}

interface WeekendEntry {
  weekendFee: number;
  weekendSurcharge?: number;
}

interface FormData {
  defaultPrice: number;
  weekendEntries: WeekendEntry[];
  seasonEntries: SeasonEntry[];
}

interface Step3Props {
  onSubmit: (data: FormData) => void;
  previousStep: () => void;
  currentStep: number;
}

export default function Step3({ onSubmit, previousStep, currentStep }: Step3Props) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      defaultPrice: 1000000,
      weekendEntries: [{ weekendFee: 6, weekendSurcharge: 2000000 }],
      seasonEntries: [
        {
          seasonFrom: new Date(),
          seasonTo: new Date(),
          seasonSurcharge: 100,
          seasonDescription: 'Ngày Lễ 20/11',
        },
      ],
    },
  });

  const weekendEntries = watch('weekendEntries');
  const seasonEntries = watch('seasonEntries');
  const selectedWeekends = new Set(weekendEntries.map((entry) => entry.weekendFee));

  useEffect(() => {
    const storedData = localStorage.getItem('step3Data');
    if (storedData) {
      const parsedData: FormData = JSON.parse(storedData);
      const formattedData: FormData = {
        ...parsedData,
        seasonEntries: parsedData.seasonEntries.map((entry) => ({
          ...entry,
          seasonFrom: entry.seasonFrom ? new Date(entry.seasonFrom) : null,
          seasonTo: entry.seasonTo ? new Date(entry.seasonTo) : null,
        })),
      };
      Object.entries(formattedData).forEach(([key, value]) =>
        setValue(key as keyof FormData, value)
      );
    }
  }, [setValue]);

  const handleFormSubmit = (data: FormData) => {
    localStorage.setItem('step3Data', JSON.stringify(data));
    onSubmit(data);
  };

  const addWeekendEntry = () => {
    if (weekendEntries.length < 2) {
      setValue('weekendEntries', [...weekendEntries, { weekendFee: 0, weekendSurcharge: 0 }]);
    }
  };

  const removeWeekendEntry = (index: number) => {
    setValue(
      'weekendEntries',
      weekendEntries.filter((_, i) => i !== index)
    );
  };

  const addSeasonEntry = () => {
    if (seasonEntries.length < 5) {
      setValue('seasonEntries', [
        ...seasonEntries,
        { seasonFrom: null, seasonTo: null, seasonSurcharge: 0, seasonDescription: '' },
      ]);
    }
  };

  const removeSeasonEntry = (index: number) => {
    setValue(
      'seasonEntries',
      seasonEntries.filter((_, i) => i !== index)
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      autoComplete="off"
      sx={{ maxWidth: 800, mx: 'auto', px: 5, width: 1000 }}
    >
      <Typography variant="h6" gutterBottom>
        Giá theo từng thời điểm của nơi lưu trú
      </Typography>

      <NumericFormat
        value={watch('defaultPrice')}
        thousandSeparator=","
        prefix="VNĐ "
        customInput={TextField}
        fullWidth
        onValueChange={(values) => setValue('defaultPrice', values.floatValue || 0)}
        error={!!errors.defaultPrice}
        helperText={errors.defaultPrice?.message}
        label="Giá mặc định"
        margin="normal"
      />

      {/* Weekend Entries */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Giá cuối tuần
      </Typography>
      {weekendEntries.map((entry, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControl fullWidth sx={{ maxWidth: '50%' }}>
            <InputLabel>Ngày cuối tuần</InputLabel>
            <Select
              label="Ngày cuối tuần"
              value={entry.weekendFee || ''}
              onChange={(e) => {
                const updatedEntries = [...weekendEntries];
                updatedEntries[index].weekendFee = Number(e.target.value);
                setValue('weekendEntries', updatedEntries);
              }}
              error={!!errors?.weekendEntries?.[index]?.weekendFee}
            >
              <MenuItem value={6} disabled={selectedWeekends.has(6)}>
                Thứ 6
              </MenuItem>
              <MenuItem value={7} disabled={selectedWeekends.has(7)}>
                Thứ 7
              </MenuItem>
            </Select>
          </FormControl>
          <NumericFormat
            value={watch(`weekendEntries.${index}.weekendSurcharge`)}
            thousandSeparator=","
            prefix="VNĐ "
            customInput={TextField}
            fullWidth
            onValueChange={(values) =>
              setValue(`weekendEntries.${index}.weekendSurcharge`, values.floatValue || 0)
            }
            error={!!errors?.weekendEntries?.[index]?.weekendSurcharge}
            helperText={errors?.weekendEntries?.[index]?.weekendSurcharge?.message}
            label="Giá mới"
            margin="normal"
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
      {seasonEntries.map((entry, index) => (
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
            name={`seasonEntries.${index}.seasonFrom`}
            render={({ field }) => (
              <>
                <DatePicker
                  {...field}
                  label="Ngày bắt đầu"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.seasonEntries?.[index]?.seasonFrom}
                      helperText={errors.seasonEntries?.[index]?.seasonFrom?.message || ''}
                    />
                  )}
                  onChange={(date) => field.onChange(date)}
                />

                {!!errors.seasonEntries?.[index]?.seasonFrom && (
                  <Typography color="error" variant="caption">
                    {errors.seasonEntries?.[index]?.seasonFrom?.message}
                  </Typography>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name={`seasonEntries.${index}.seasonTo`}
            render={({ field }) => (
              <>
                <DatePicker
                  {...field}
                  label="Ngày kết thúc"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.seasonEntries?.[index]?.seasonTo}
                      helperText={errors.seasonEntries?.[index]?.seasonTo?.message || ''}
                    />
                  )}
                  onChange={(date) => field.onChange(date)}
                />
                {!!errors.seasonEntries?.[index]?.seasonTo && (
                  <Typography color="error" variant="caption">
                    {errors.seasonEntries?.[index]?.seasonTo?.message}
                  </Typography>
                )}
              </>
            )}
          />
          <NumericFormat
            value={watch(`seasonEntries.${index}.seasonSurcharge`)}
            thousandSeparator=","
            prefix="VNĐ "
            customInput={TextField}
            fullWidth
            onValueChange={(values) =>
              setValue(`seasonEntries.${index}.seasonSurcharge`, values.floatValue || 0)
            }
            error={!!errors.seasonEntries?.[index]?.seasonSurcharge}
            helperText={errors.seasonEntries?.[index]?.seasonSurcharge?.message}
            label="Giá mới"
            margin="normal"
          />

          <IconButton onClick={() => removeSeasonEntry(index)} color="error">
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={addSeasonEntry} color="primary">
        <AddIcon />
      </IconButton>

      {/* Actions */}
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={previousStep} variant="outlined">
          Quay lại
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Tiếp theo
        </Button>
      </DialogActions>
    </Box>
  );
}
