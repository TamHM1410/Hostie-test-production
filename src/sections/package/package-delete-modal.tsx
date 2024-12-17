import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {  useCurrentPackage } from 'src/zustand/store';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createdRoleApi } from 'src/api/users';
import { deleteRoleApi } from 'src/api/users';
import { delete_package_api } from 'src/api/pagekages';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const DeletePackageModal = (props: any) => {
  const [open, setOpen] = useState(false);
  const { currentPackage } = useCurrentPackage();
  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn: (payload: any) => delete_package_api(payload),
    onSuccess: () => {
      setOpen(!open);
      toast.success('Deleted success');
      queryClient.invalidateQueries(['packageList']as any);
    },
    onError: (error) => {
      toast.error('Error');
    },
  });

  console.log(currentPackage, 'current role');

  const onSubmit = async () => {
    try {
      mutate(currentPackage.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2, width: 130 ,color:'red'}}>
        <DeleteOutlineIcon /> Xóa
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
            Bạn có chắc muốn xóa không?
          </Typography>
          <FormControl onSubmit={onSubmit} sx={{ width: '100%' }}>
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
                ></Box>
                <Typography sx={{ width: '100%' }}> Hành động này không thể lặp lại.</Typography>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="error"
                    type="submit"
                    onClick={() => onSubmit()}
                  >
                    Xóa
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default DeletePackageModal;
