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
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  defaultPrice: Yup.number()
    .required('Giá mặc định là bắt buộc')
    .positive('Giá phải là số dương')
    .max(10000, 'Giá mặc định không được vượt quá 10,000'),
  weekendEntries: Yup.array().of(
    Yup.object().shape({
      weekendFee: Yup.number().required('Vui lòng chọn ngày cuối tuần'),
      weekendSurcharge: Yup.number()
        .nullable()
        .positive('Phát sinh phải là số dương')
        .max(200, 'Phát sinh không được vượt quá 200'),
    })
  ),
  seasonEntries: Yup.array().of(
    Yup.object().shape({
      seasonFrom: Yup.date().nullable().required('Ngày bắt đầu là bắt buộc'),
      seasonTo: Yup.date()
        .nullable()
        .required('Ngày kết thúc là bắt buộc')
        .min(Yup.ref('seasonFrom'), 'Ngày kết thúc phải lớn hơn ngày bắt đầu')
        .max(
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          'Ngày kết thúc không được lớn hơn 1 năm kể từ ngày hiện tại'
        ),
      seasonSurcharge: Yup.number()
        .nullable()
        .positive('Phát sinh phải là số dương')
        .max(500, 'Phát sinh không được vượt quá 500'),
      seasonDescription: Yup.string().required('Mô tả là bắt buộc'), // Add description validation
    })
  ),
});

// Define the structure for each entry
interface SeasonEntry {
  seasonFrom: any | null ;
  seasonTo: any | null ;
  seasonSurcharge?: number ;
  seasonDescription: string ; // Add description field to SeasonEntry
}

interface WeekendEntry {
  weekendFee: number;
  weekendSurcharge?: number ;
}

interface FormData {
  defaultPrice: number ;
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
    formState: { errors  },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      weekendEntries: [],
      seasonEntries: [],
      defaultPrice: 0,
    },
  });

  const weekendEntries = watch('weekendEntries');
  const seasonEntries = watch('seasonEntries');

  const selectedWeekends = new Set(weekendEntries.map((entry: any) => entry.weekendFee));

  useEffect(() => {
    const storedData = localStorage.getItem('step3Data');

    if (storedData) {
      const parsedData: FormData = JSON.parse(storedData);
      const formattedData: FormData = {
        ...parsedData,
        seasonEntries: parsedData.seasonEntries.map((entry: SeasonEntry) => ({
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

  const onFormSubmit = (data: FormData) => {
    localStorage.setItem('step3Data', JSON.stringify(data));
    console.log(data);
    onSubmit(data); // Call onSubmit to move to the next step
  };

  // Functions for managing weekend entries
  const addWeekendEntry = () => {
    if (weekendEntries.length < 2) {
      // Allow max 2 weekend entries
      setValue('weekendEntries', [...weekendEntries, { weekendFee: 0 }]);
    }
  };

  const removeWeekendEntry = (index: number) => {
    const updatedEntries = weekendEntries.filter((_, i: any) => i !== index);
    setValue('weekendEntries', updatedEntries);
  };

  // Functions for managing season entries
  const addSeasonEntry = () => {
    if (seasonEntries.length < 5) {
      // Allow max 5 season entries
      setValue('seasonEntries', [
        ...seasonEntries,
        { seasonFrom: null, seasonTo: null, seasonSurcharge: undefined, seasonDescription: '' },
      ]);
    }
  };

  const removeSeasonEntry = (index: number) => {
    const updatedEntries = seasonEntries.filter((_, i: any) => i !== index);
    setValue('seasonEntries', updatedEntries);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      autoComplete="off"
      sx={{ maxWidth: 450, mx: 'auto', p: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        Giá theo từng thời điểm của nơi lưu trú
      </Typography>

      <TextField
        label="Giá mặc định"
        variant="outlined"
        fullWidth
        type="number"
        {...register('defaultPrice')}
        error={!!errors.defaultPrice}
        helperText={errors.defaultPrice?.message}
        margin="normal"
      />

      <Divider sx={{ marginBottom: 3, marginTop: 3 }} />

      {/* Weekend Entries */}
      <Typography variant="h6" gutterBottom>
        Giá cuối tuần
      </Typography>
      {weekendEntries.map((entry: any, index: any) => (
        <Box
          key={index}
          sx={{ width: '1/2', display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}
        >
          <FormControl
            fullWidth
            margin="normal"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 2,
            }}
          >
            <InputLabel>Ngày cuối tuần</InputLabel>
            <Select
              label="Ngày cuối tuần"
              value={entry.weekendFee || ''}
              onChange={(e) => {
                const newWeekendEntries = [...weekendEntries];
                newWeekendEntries[index].weekendFee = Number(e.target.value);
                setValue('weekendEntries', newWeekendEntries);
              }}
              error={!!errors?.weekendEntries?.[index]?.weekendFee}
              fullWidth // Make Select take full width
            >
              <MenuItem value={6} disabled={selectedWeekends.has(6)}>
                Thứ 6
              </MenuItem>
              <MenuItem value={7} disabled={selectedWeekends.has(7)}>
                Thứ 7
              </MenuItem>
            </Select>
            {errors?.weekendEntries?.[index]?.weekendFee && (
              <Typography variant="caption" color="error">
                {errors?.weekendEntries?.[index]?.weekendFee?.message}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Giá"
            variant="outlined"
            type="number"
            {...register(`weekendEntries.${index}.weekendSurcharge`)}
            error={!!errors?.weekendEntries?.[index]?.weekendSurcharge}
            helperText={errors?.weekendEntries?.[index]?.weekendSurcharge?.message}
          />
          <IconButton onClick={() => removeWeekendEntry(index)} color="error">
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={addWeekendEntry} color="primary">
        <AddIcon />
      </IconButton>

      <Divider sx={{ marginBottom: 3, marginTop: 3 }} />

      {/* Season Entries */}
      <Typography variant="h6" gutterBottom>
        Giá theo mùa
      </Typography>
      {seasonEntries.map((entry: any, index: any) => (
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2, marginTop: 4 }}
        >
          <Controller
            control={control}
            name={`seasonEntries.${index}.seasonFrom`}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Ngày bắt đầu"
            
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.seasonEntries?.[index]?.seasonFrom}
                    helperText={errors.seasonEntries?.[index]?.seasonFrom?.message}
                  />
                )}
                onChange={(date: any) => field.onChange(date)}
              />
            )}
            
          />
          <Controller
            control={control}
            name={`seasonEntries.${index}.seasonTo`}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Ngày kết thúc"
                // slotProps={{
                //     textField: {
                //       fullWidth: true,
                //       error: !!errors.seasonEntries?.[index]?.seasonTo,
                //       helperText:  typeof errors.seasonEntries?.[index]?.seasonFrom?.message === 'string'
                //       ? errors.seasonEntries?.[index]?.seasonFrom?.message
                //       : ''
                //     },
                //   }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.seasonEntries?.[index]?.seasonTo}
                    helperText={errors.seasonEntries?.[index]?.seasonTo?.message}
                  />
                )}
                onChange={(date: any) => field.onChange(date)}
              />
            )}
          />
          <TextField
            label="Giá"
            variant="outlined"
            type="number"
            {...register(`seasonEntries.${index}.seasonSurcharge`)}
            error={!!errors.seasonEntries?.[index]?.seasonSurcharge}
            helperText={errors.seasonEntries?.[index]?.seasonSurcharge?.message}
          />
          <TextField
            label="Mô tả"
            variant="outlined"
            {...register(`seasonEntries.${index}.seasonDescription`)}
            error={!!errors.seasonEntries?.[index]?.seasonDescription}
            helperText={errors.seasonEntries?.[index]?.seasonDescription?.message}
            fullWidth
          />
          <IconButton onClick={() => removeSeasonEntry(index)} color="error">
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={addSeasonEntry} color="primary">
        <AddIcon />
      </IconButton>

      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={previousStep} disabled={currentStep === 0}>
          Trở lại
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Tiếp theo
        </Button>
      </DialogActions>
    </Box>
  );
}
