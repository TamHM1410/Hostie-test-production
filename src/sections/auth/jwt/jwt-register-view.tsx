'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';

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
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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

import { SignUp, socialUrls } from 'src/types/users';
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
  const [listSocial, setListUrl] = useState<socialUrls[] | any[]>([]);

  const [isChecked, setIsChecked] = useState(false); // Chú ý 'setIsChecked' thay vì 'setIschecked'

  const [currentTab, setCurrentTab] = useState('user');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object()
    .shape({
      username: Yup.string().required('Nhập tên đăng nhập'),
      referenceCode: Yup.string().notRequired(),
      email: Yup.string().required('Email là bắt buộc').email('Email phải là địa chỉ email hợp lệ'),
      password: Yup.string().required('Mật khẩu là bắt buộc').min(8, 'Mật khẩu ít nhất 8 ký tự'),
      retype_password: Yup.string()
        .required('Mật khẩu là bắt buộc')
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
      socialUrls: Yup.array()
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
      profile_images: Yup.array()
        .min(3, 'Chỉ được tải lên tối đa 3 ảnh')
        .max(3, 'Chỉ được tải lên tối đa 3 ảnh'),
    })
    .test(
      'at-least-one',
      'Phải có ít nhất một trong referenceCode   hoặc socialUrls',
      function (value) {
        // Nếu không có giá trị, coi như không hợp lệ
        if (!value) return false;

        const { referenceCode, socialUrls } = value;

        // Kiểm tra từng điều kiện
        const hasReferenceCode = referenceCode && referenceCode.trim() !== '';
        const hasSocialUrls =
          Array.isArray(socialUrls) &&
          socialUrls.some((social) => social.url?.trim() || social.social_name?.trim());

        return hasReferenceCode || hasSocialUrls;
      }
    );

  const defaultValues: any = {
    username: '',
    retype_password: '',
    email: '',
    password: '',
    socialUrls: listSocial,
    referenceCode: '',
    isChecked: isChecked,
    profile_images: [],
  };
  // Dropzone configuration
  const onDrop = (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > 3) {
      toast.error('Chỉ được tải lên tối đa 3 ảnh');
      return;
    }
    // Limit to 3 images
    const newFiles = acceptedFiles.slice(0, 3 - uploadedFiles.length);

    // Generate previews
    const newPreviews = newFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
      });
    });

    Promise.all(newPreviews).then((previews) => {
      setPreviewImages((prev) => [...prev, ...previews]);
    });

    // Update uploaded files
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setValue('profile_images', [...uploadedFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB max file size
    multiple: true,
    maxFiles: 3,
  });

  const handleRemoveImage = (index: number) => {
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);

    setPreviewImages(newPreviewImages);
    setUploadedFiles(newUploadedFiles);
    setValue('profile_images', newUploadedFiles);
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
    setValue(`socialUrls[${index}].social_name` as any, event.target.value);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    console.log(data, 'dta');
    const formData = new FormData();
    try {
      delete data['isChecked'];
      if (data?.referenceCode === '') {
        delete data['referenceCode  '];
      }
      if (Array.isArray(data?.socialUrls) && data?.socialUrls.length === 0) {
        delete data['socialUrls'];
      }
      Object.keys(data).forEach((key, value) => {
        if (key === 'profile_images' && data.profile_images && data.profile_images.length > 0) {
          // formData.append(key,JSON.stringify( data[key]));
          data.profile_images.forEach((file: File, index: number) => {
            formData.append(`imageFiles[]`, file);
          });
        }

        if (key === 'socialUrls' && Array.isArray(data[key])) {
          data[key].forEach((item, index) => {
            formData.append(`socialUrls[${index}].url`, item?.url);
            formData.append(`socialUrls[${index}].socialName`, item?.social_name);
          });
          delete data['socialUrls'];
        }

        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Append profile images

      setIsChecked(false);

      // console.log(formData,'form data')

      const res = await registerApi(formData);
      if (res) {
        toast.success('Đăng ký thành công');
        router.push('/auth/jwt/login');
      }
    } catch (error) {
      toast.error(error);
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
      {'The hostie since 2024'}
     

      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
       
        <RHFTextField name="email" label="Địa chỉ email* " />
        <RHFTextField name="username" label="Tên đăng nhập*" />
        <RHFTextField name="referenceCode " label="Mã giới thiệu " />

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

<Box
          {...getRootProps()}
          sx={{
            border: '2px dashed grey',
            borderColor: isDragActive ? 'primary.main' : 'grey.500',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease',
          }}
        >
          <input {...getInputProps()} />
          {previewImages.length < 3 ? (
            <Typography variant="body2" color="text.secondary">
              {isDragActive
                ? 'Thả hình ảnh ở đây'
                : `Vui lòng cung cấp hình ảnh  để giúp quản trị viên dễ dàng duyệt tài khoản của bạn (${previewImages.length}/3)`}
            </Typography>
          ) : null}

          {/* Image previews */}
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {previewImages.map((preview, index) => (
              <Grid item xs={4} key={index} sx={{ position: 'relative' }}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: '100%',
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    color: 'error.main',
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Box>

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
                name={`socialUrls[${index}].social_name`}
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="linkin">Linkin</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
              </Select>
              <RHFTextField name={`socialUrls[${index}].url`} label="Địa chỉ" />
              {listSocial.length > 0 && (
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
