//  @hooks
import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoleManagement } from 'src/api/useRoleManagement';

//  @lib
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';

//  @type
import { Role } from 'src/types/users';

const AddNewRoleModal = (props: any) => {
  const { createNewRole } = useRoleManagement();

  const [open, setOpen] = useState(false);
  //   const { currenUserSelected } = useCurrentUser();
  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn: async (payload: any) => {
      const res = await createNewRole(payload);
      setOpen(!open);
      queryClient.invalidateQueries(['roleList'] as any);
      reset();

      return 'dsdjsods';
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error, 'err');
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Chưa nhập thông tin'),
    status: Yup.number().notRequired(),
    description: Yup.string().required('Chưa nhập thông tin'),
  });

  const defaultValues: Pick<Role, 'name' | 'status' | 'description'> = {
    name: '',
    status: 2,
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
      mutate(data);
    } catch (error) {}
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2 }}>
        <AddIcon /> Thêm mới quyền
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
            Thêm mới quyền
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
                  <RHFTextField name="description" label=" Mô tả" />

                  {/* <RHFTextField name="status" label="Trạng thái" /> */}
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Thêm
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

export default AddNewRoleModal;
