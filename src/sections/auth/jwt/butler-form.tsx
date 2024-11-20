'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes

import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
// auth
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { registerButler } from 'src/api/butler';


/// toast
import toast from 'react-hot-toast';


// ----------------------------------------------------------------------

export default function ButlerForm() {
  const router = useRouter();

  // const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required(' Nhập tên đăng nhập'),
    housekeeperRegistrationCode: Yup.string().required('First name required'),
    email: Yup.string().required('Email là bắt buộc').email('Email phải là địa chỉ email hợp lệ'),
    password: Yup.string().required('Mật khẩu là bắt buộc').min(8, 'mật khẩu ít nhất 8 ký tự'),
    retype_password: Yup.string().required('Mật khẩu là bắt buộc').oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
  });

  const defaultValues: any = {
    username: '',
    retype_password: '',
    email: '',
    password: '',
    housekeeperRegistrationCode: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: any) => {
    try {
    delete data?.retype_password

    const rs =   await registerButler(data)
    // const rs =await findAllHousekeeperResidence()
    console.log(rs,'datawithout retype')

   

      //   toast.success('Register success');
        // router.push('/auth/jwt/login');
    } catch (error) {
      //   toast.error('Something wrong');
    //   reset();
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <RHFTextField name="email" label="Địa chỉ email* " />
        <RHFTextField name="username" label="Tên đăng nhập*" />
        <RHFTextField
          name="housekeeperRegistrationCode"
          label="Mã giới thiệu*(Dành cho quản gia) "
        />

        <RHFTextField
          name="password"
          label="Mật khẩu*"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="retype_password"
          label="Nhập lại mật khẩu*"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Tạo tài khoản
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
