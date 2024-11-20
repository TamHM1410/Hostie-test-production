'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// assets
import { PasswordIcon } from 'src/assets/icons';
import { EmailInboxIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { sendForgotPassword } from 'src/api/users';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------
const RenderSendedEmail = () => {
  return (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={3} alignItems="center">
     

      
        <Link
          component={RouterLink}
          href={'https://mail.google.com/mail'}
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          Đã gửi yêu cầu đặt lại mật khẩu.Vui lòng kiểm tra email của bạn
        </Link>
      </Stack>


    </>
  );
};
export default function ModernForgotPasswordView() {
  const [isEmailSend, setEmailSend] = useState(false);
  // const router = useRouter();
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Yêu cầu email của bạn').email('Phải có dạng email'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await sendForgotPassword(data);
      setEmailSend(!isEmailSend);
      // router.push('/auth/reset-password');
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Địa chỉ email" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        Gửi yêu cầu
      </LoadingButton>

      <Link
        component={RouterLink}
        href={'/auth/jwt/login'}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Trở về đăng nhập
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Quên mật khẩu?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {isEmailSend == false ? (
        <>
          {' '}
          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderHead}

            {renderForm}
          </FormProvider>
        </>
      ) : (
        <>
          <RenderSendedEmail />{' '}
        </>
      )}
    </>
  );
}
