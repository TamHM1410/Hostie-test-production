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

import AddIcon from '@mui/icons-material/Add';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Role } from 'src/types/users';
import { createdRoleApi } from 'src/api/users';
import { PackageType } from 'src/types/pagekages';
import { create_new_package } from 'src/api/pagekages';

const AddNewPAac = (props: any) => {


  const [open,setOpen]=useState(false)
//   const { currenUserSelected } = useCurrentUser();
  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn:async (payload: any) => await  create_new_package(payload),
    onSuccess: () => {
      
        setOpen(!open)
        toast.success('created success')
        queryClient.invalidateQueries(['packageList']as any);
        reset()

    },
    onError: (error) => {
      toast.error('Error');
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required'),
    description: Yup.string().required('Email is required'),
  });

  const defaultValues: Pick< PackageType ,'name'|'price'|'description'> = {
    name: '',
    price: 0,
    description: '',
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
        mutate(data)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2}}>
        <AddIcon /> Thêm mới gói
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
            minWidth:{xs:300, md:500,lg:800},

            bgcolor: 'background.paper',
            borderRadius:2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
           Thêm mới
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
                  <RHFTextField name="name" label=" tên" />
                  <RHFTextField name="description" label="Mô tả" />

                  <RHFTextField name="price" label="Giá" />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                 
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Thêm mới
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

export default AddNewPAac;
