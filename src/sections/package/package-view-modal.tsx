import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCurrentUser } from 'src/zustand/store';
import AddIcon from '@mui/icons-material/Add';
import { UserManagement } from 'src/types/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminUpdateUserById } from 'src/api/users';
import { Role } from 'src/types/users';
import { createdRoleApi } from 'src/api/users';
import { aW } from '@fullcalendar/core/internal-common';
import { Edit } from '@mui/icons-material';
import { useCurrentPackage } from 'src/zustand/store';
import { updatedRoleApi } from 'src/api/users';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PackageFormType } from 'src/types/pagekages';
import { update_package } from 'src/api/pagekages';
import VisibilityIcon from '@mui/icons-material/Visibility';
const PackageDetail = (props: any) => {
  const { currentPackage } = useCurrentPackage();
  const [open, setOpen] = useState(false);
  const [status, setstatus] = React.useState(currentPackage?.status);
  //   const { currenUserSelected } = useCurrentUser();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    status: Yup.number().notRequired(),
    description: Yup.string().required('Email is required'),
    price: Yup.string().required('Price is required'),
    // id:Yup.number().notRequired()
  });

  const defaultValues: PackageFormType | any = {
    // id: currentPackage?.id||0,
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

  const onSubmit = async (data: any) => {
    try {
    } catch (error) {}
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
            height: 550,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
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
                  gridTemplateColumns={{
                    xs: 'repeat(0, 1fr)',
                    sm: 'repeat(0, 1fr)',
                  }}
                >
                  <RHFTextField name="name" label=" Name" aria-readonly />
                  <RHFTextField name="description" label=" Description" aria-readonly />
                  <RHFTextField name="price" label=" Price" aria-readonly />

                  <RHFTextField name="status" label="Status" aria-readonly />
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

export default PackageDetail;
