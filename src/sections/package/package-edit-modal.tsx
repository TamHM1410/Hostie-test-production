import * as React from 'react';
import * as Yup from 'yup';
//  @hook
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentPackage } from 'src/zustand/store';
import { usePackage } from 'src/api/usePackage';
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
import { PackageFormType } from 'src/types/pagekages';
import { update_package } from 'src/api/pagekages';

const EditPackage = (props: any) => {
  const { updatePackage } = usePackage();

  const { currentPackage } = useCurrentPackage();

  const [open, setOpen] = useState(false);

  const [status, setstatus] = React.useState(currentPackage?.status);

  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn: ({ id, payload }: { id: any; payload: any }) => updatePackage(id, payload),
    onSuccess: () => {
      setOpen(!open);
      queryClient.invalidateQueries(['packageList'] as any);
      reset();
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    status: Yup.number().notRequired(),
    description: Yup.string().required('Email is required'),
    price: Yup.string().required('Price is required'),
  });

  const defaultValues: PackageFormType | any = {
    name: currentPackage?.name || '',
    status: status || 0,
    description: currentPackage?.description || '',
    price: currentPackage?.price || '',
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
      let payload = {
        ...data,
        status: defaultValues?.status,
      };
      let id = currentPackage?.id;
      mutate({ id, payload });
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
            minWidth: { xs: 300, md: 500, lg: 800 },
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
                  <RHFTextField name="name" label=" Name" />
                  <RHFTextField name="description" label=" Description" />
                  <RHFTextField name="price" label=" Price" />

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
                        <MenuItem value={1}>Xét duyệt</MenuItem>
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
                    Lưu
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

export default EditPackage;
