import * as React from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import { UserManagement } from 'src/types/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminUpdateUserById } from 'src/api/users';



const UserEditModal = (props: any) => {
  const { open, setOpen } = props;
  const { currenUserSelected } = useCurrentUser();
  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn: (payload: any) => adminUpdateUserById(payload),
    onSuccess: () => {},
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: 'usersList' } as any);
      toast.error('Error');
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    username: Yup.string().required('Name is required'),
    id:Yup.number().notRequired(),
    emailVerified: Yup.string().required('Email verification status is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    roles: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required('Role name is required'),
        })
      )
      .min(1, 'At least one role is required'),
    status: Yup.string(),
  });

  const defaultValues: UserManagement | any = {
    id: currenUserSelected.id,
    username: currenUserSelected.username || '',
    emailVerified:
      currenUserSelected.emailVerified === true ? 'Email verified' : 'Email not verified',
    email: currenUserSelected.email || '',
    roles: currenUserSelected.roles || [],
    status: currenUserSelected.status || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
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
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2 }}>
        <EditIcon /> Edit
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
            height: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            User Edit
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
                  <RHFTextField name="id" label="id"  sx={{display:'none'}}/>

                  <RHFTextField name="username" label="User Name" />
                  <RHFTextField name="email" label="Email" />
                  <RHFTextField name="emailVerified" label="Email Verified" />
                  {currenUserSelected.roles.map((role: any, index: number) => (
                    <RHFTextField
                      key={index}
                      name={`roles[${index}].name`}
                      label={`Role ${index + 1}`}
                      defaultValue={role.name}
                    />
                  ))}
                  <RHFTextField name="status" label="Status" />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Save Change
                  </LoadingButton>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Cancel
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

export default UserEditModal;
