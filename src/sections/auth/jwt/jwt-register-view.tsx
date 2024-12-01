'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
// auth

// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Button } from '@mui/material';

import { SignUp, social_urls } from 'src/types/users';
import { registerApi } from 'src/api/users';

/// toast
import toast from 'react-hot-toast';
import RegisterTab from './register-tab';
import ButlerForm from './butler-form';
import RegisterPrivacy from './register-privacy';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const router = useRouter();

  // const [errorMsg, setErrorMsg] = useState('');
  const [listSocial, setListUrl] = useState<social_urls[] | any[]>([
    {
      url: '',
      social_name: '',
    },
  ]);

  const [isChecked, setIsChecked] = useState(false); // Chú ý 'setIsChecked' thay vì 'setIschecked'

  const [currentTab, setCurrentTab] = useState('user');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object()
    .shape({
      username: Yup.string().required('Nhập tên đăng nhập'),
      reference_code: Yup.string().notRequired(),
      email: Yup.string().required('Email là bắt buộc').email('Email phải là địa chỉ email hợp lệ'),
      password: Yup.string().required('Mật khẩu là bắt buộc').min(8, 'Mật khẩu ít nhất 8 ký tự'),
      retype_password: Yup.string()
        .required('Mật khẩu là bắt buộc')
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
      social_urls: Yup.array()
        .of(
          Yup.object().shape({
            url: Yup.string().notRequired(),
            social_name: Yup.string().notRequired(),
          })
        )
        .notRequired(),
      isChecked: Yup.boolean()
        .oneOf([true], 'Bạn cần đồng ý với điều khoản')
        .required('Bạn cần đồng ý với điều khoản'),
    })
    .test(
      'at-least-one',
      'Phải có ít nhất một trong reference_code hoặc social_urls',
      function (value) {
        // Nếu không có giá trị, coi như không hợp lệ
        if (!value) return false;

        const { reference_code, social_urls } = value;

        // Kiểm tra từng điều kiện
        const hasReferenceCode = reference_code && reference_code.trim() !== '';
        const hasSocialUrls =
          Array.isArray(social_urls) &&
          social_urls.some((social) => social.url?.trim() || social.social_name?.trim());

        return hasReferenceCode || hasSocialUrls;
      }
    );

  const defaultValues: any = {
    username: '',
    retype_password: '',
    email: '',
    password: '',
    social_urls: listSocial,
    reference_code: '',
    isChecked: isChecked,
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;
  const handleRemoveSocial = (index: any) => {
    const newList = listSocial.filter((_, i) => i !== index);
    setListUrl(newList);
  };
  const handleAddNewSocial = () => {
    setListUrl((prevList) => [
      ...prevList,
      {
        url: '',
        social_name: '',
      },
    ]);
  };

  const handleChange = (event: SelectChangeEvent, index: number) => {
    const newSocialName = event.target.value; // Get the new social name from the event
    setListUrl((prevList) => {
      const updatedList = [...prevList]; // Create a shallow copy of the previous list
      updatedList[index] = { ...updatedList[index], social_name: newSocialName }; // Update the specific item
      return updatedList; // Return the updated list
    });
    setValue(`social_urls[${index}].social_name` as any, event.target.value);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      delete data['isChecked'];
      if (data?.reference_code === '') {
        delete data['reference_code'];
      }

      if (Array.isArray(data?.social_urls) && data?.social_urls.length === 0) {
        delete data['social_urls'];
      }
      const res = await registerApi(data);
      toast.success('Đăng ký thành công');

      router.push('/auth/jwt/login');
    } catch (error) {
      toast.error(` 'Có lỗi xảy ra. Vui lòng thử lại.'}`);
    }
  });
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">Đăng ký tài khoản</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Đã có tài khoản? </Typography>

        <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
          Đăng nhập
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <RHFTextField name="email" label="Địa chỉ email* " />
        <RHFTextField name="username" label="Tên đăng nhập*" />
        <RHFTextField name="reference_code" label="Mã giới thiệu* " />

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

        {listSocial &&
          listSocial.map((item: any, index: any) => (
            <Stack
              key={index}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ transitionDuration: 10, animationDuration: 10 }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={item.social_name === '' ? 'Mạng xã hội' : 'facebook'}
                label="social"
                onChange={(event) => handleChange(event, index)}
                name={`social_urls[${index}].social_name`}
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="linkin">Linkin</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
              </Select>
              <RHFTextField name={`social_urls[${index}].url`} label="Địa chỉ" />
              {listSocial.length > 1 && (
                <span
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => handleRemoveSocial(index)}
                >
                  <DeleteOutlineIcon />
                </span>
              )}
            </Stack>
          ))}
        <Stack direction={{ xs: 'column', sm: 'row', display: 'row-reverse' }} spacing={2}>
          <Button onClick={handleAddNewSocial}>Thêm địa chỉ mạng xã hội</Button>
        </Stack>
        <RegisterPrivacy
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          reset={reset}
          methods={methods}
        />
        {methods.formState.errors.isChecked && (
          <Typography color="error" variant="body2">
            {methods.formState.errors.isChecked.message}
          </Typography>
        )}

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

  return (
    <>
      {renderHead}
      <RegisterTab currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 'user' && renderForm}
      {currentTab === 'butler' && <ButlerForm />}

      {renderTerms}
    </>
  );
}
