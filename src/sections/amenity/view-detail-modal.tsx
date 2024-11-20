import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card } from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCurrentAmenity } from 'src/zustand/store';

import InputLabel from '@mui/material/InputLabel';

import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Image from 'next/image';
import { Edit } from '@mui/icons-material';
import { AmenityFormType } from 'src/types/amenity';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewDetailModal = () => {
  const { currentAmenity } = useCurrentAmenity();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentAmenity?.status);
  const [type, setType] = useState(currentAmenity?.iconType);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    iconSize: Yup.string().required('Size is required'),
    iconPath: Yup.string().required('Path is required'),
  });

  const defaultValues: AmenityFormType | any = {
    name: currentAmenity?.name || '',
    status: currentAmenity?.status || 0,
    iconPath: currentAmenity?.iconPath || '',
    iconType: currentAmenity?.iconType || '',
    iconSize: currentAmenity?.iconSize || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues); // Reset form khi currentAmenity thay đổi
  }, [currentAmenity, reset]);

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const onSubmit = async (data: any) => {
    try {
    } catch (error) {
      console.error(error, 'err');
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2, width: 130 }}>
        <VisibilityIcon /> Xem
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 630,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
           Chi tiết
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid md={12} xs={8}>
              <Card sx={{ p: 3, mt: 2 }}>
                <Box
                  rowGap={3}
                  columnGap={3}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="name" label="Tên" aria-readonly />
                  <RHFTextField name="iconSize" label="kích thước" aria-readonly />
                  <RHFTextField name="status" label="Trạng thái" aria-readonly />
                  <RHFTextField name="iconType" label="Loại" aria-readonly />

                  <Box sx={{ display: 'flex', gap: 10 }}>
                    <Image src={watch('iconPath')} alt="Icon Preview" width={50} height={50} />
                    <RHFTextField name="iconPath" label="Current Icon path" disabled />
                  </Box>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Đóng
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
};

export default ViewDetailModal;
