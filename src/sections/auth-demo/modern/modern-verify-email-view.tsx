'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';

import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';

// routes

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// assets
import { SentIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFCode } from 'src/components/hook-form';
import { confirmVerifyEmail } from 'src/api/users';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

export default function ModernNewVerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [sending, setSending] = useState(false);

  const NewPasswordSchema = Yup.object().shape({
    // code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });
  const defaultValues = {
    // code: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSend = async () => {
    try {
      setSending(true);
      const res = await confirmVerifyEmail(token);
      if (res) {
        toast.success('Xác nhận thành công');
        router.push('/');
        setSending(false);
      }
    } catch (error) {
      console.error(error);
      setSending(false);
      toast.error('Error');
    }
  };
  const onSubmit = async () => {};

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={sending}
        onClick={onSend}
      >
        Xác nhận
      </LoadingButton>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h5">
          Vui lòng xác nhận để hoàn tất quá trình xác thực email của bạn.{' '}
        </Typography>
      </Stack>
    </>
  );
  //  if(!token){
  //   router.push('/')
  //  }
  return (
    <>
      {renderHead}

      {renderForm}
    </>
  );
}
