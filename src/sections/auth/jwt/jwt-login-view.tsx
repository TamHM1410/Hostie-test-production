'use client';

//  hooks
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useState, useEffect } from 'react';

//  @lib
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn, useSession } from 'next-auth/react';
import { useLogin } from 'src/api/users';
//  @react
import { RouterLink } from 'src/routes/components';

import { paths } from 'src/routes/paths';

//  @component
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import toast from 'react-hot-toast';

/// @mui
import { LoadingButton } from '@mui/lab';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuth } from 'src/api/useAuth';

export default function JwtLoginView() {
  const router = useRouter();

  const { login } = useAuth();

  const [errorMsg, setErrorMsg] = useState('');

  const [defaultValues, setDefaultValues] = useState({
    username: '',
    password: '',
  });

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập là bắt buộc'),
    password: Yup.string().required('Mật khẩu là bắt buộc'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: any, event: any) => {
    event?.preventDefault();

    try {
      const res = await login(data);

      if (res) {
        await signIn('credentials', {
          username: res?.username,
          id: res?.userId,
          email: res?.email,
          isActive: res?.isActive,
          roles: res?.roles,
          token: res?.token,
          status: res?.status,
          urlAvatar: res?.urlAvatar,
          redirect: true,
        });
      }

      toast.success('Đăng nhập thành công!');
    } catch (error) {
      // toast.error(error);
      console.log('axios', error);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Đăng nhập vào Hostie</Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Người dùng mới?</Typography>
        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Tạo tài khoản
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <RHFTextField name="username" label="Tên đăng nhập" />
      <RHFTextField
        name="password"
        label="Mật khẩu"
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
      <Link
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}
      >
        <span onClick={() => router.push('/auth/forgot-password')}>Quên mật khẩu?</span>
      </Link>
      <LoadingButton
        loading={isSubmitting}
        type="submit"
        variant="contained"
        color="inherit"
        fullWidth
      >
        Đăng nhập
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
  );
}
