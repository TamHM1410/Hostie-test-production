import * as React from 'react';
import * as Yup from 'yup';

//  @hook
import { useState } from 'react';
import { useResidence } from 'src/api/useResidence';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Grid, Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Edit } from '@mui/icons-material';

import toast from 'react-hot-toast';

//  @store
import { useCurrentResidenceType } from 'src/zustand/store';
import { update_residence_type } from 'src/api/residence';

const EditResidenceTypeModal = () => {
  const { updateResidenceType } = useResidence();

  const { currentResidenceType } = useCurrentResidenceType();

  const [open, setOpen] = useState(false);

  const [status, setstatus] = React.useState(currentResidenceType?.status);

  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn: ({ payload, id }: { id: any; payload: any }) => updateResidenceType(payload, id),
    onSuccess: () => {
      setOpen(!open);
      queryClient.invalidateQueries(['residenceTypeList'] as any);
      reset();
    },
    onError: (error) => {
      toast.error('Error');
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    status: Yup.number().notRequired(),
    description: Yup.string().required('description is required'),
  });

  const defaultValues: any = {
    name: currentResidenceType?.name || '',
    status: status || 0,
    description: currentResidenceType?.description || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleChange = (event: SelectChangeEvent) => {
    setstatus(event.target.value as string);
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        status: defaultValues?.status,
      };
      const id = currentResidenceType?.id;
      mutate({ payload, id });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2, width: 130 }}>
        <Edit /> Sửa
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
            width: 'auto',
            height: 'auto',
            minWidth: { xs: 300, md: 600, lg: 800 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Sửa
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid md={12} xs={8}>
              <Card sx={{ p: 3, mt: 2 }}>
                <Box
                  rowGap={3}
                  columnGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(0, 1fr)',
                    sm: 'repeat(0, 1fr)',
                  }}
                >
                  <RHFTextField name="name" label=" Tên" />
                  <RHFTextField name="description" label="Mô tả" />

                  {/* <RHFTextField name="status" label="Status" /> */}
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Age"
                        onChange={handleChange}
                      >
                        <MenuItem value={0}>Từ chối</MenuItem>
                        <MenuItem value={1}>Chờ duyệt</MenuItem>
                        <MenuItem value={2}>Chấp thuận</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Lưu & thay đổi
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
};

export default EditResidenceTypeModal;
