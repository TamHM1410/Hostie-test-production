import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// hooks
// utils
import { fData } from 'src/utils/format-number';
// assets
import Image from 'next/image'; // components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { updateUserById, getUserInfor } from 'src/api/users';
// ----------------------------------------------------
import { useMutation, useQuery } from '@tanstack/react-query';
/// type
import { UserInfor } from 'src/types/users';
import { useDefaultAvatar } from 'src/hooks/use-avatar';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Textfield from '../_examples/mui/textfield-view/textfield';
import { useGetUserCurrentRole } from 'src/zustand/user';

import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
///

//------------------
const updateInfor = async (payload: any) => {
  const res = await updateUserById(payload);
  if (!res) {
    throw new Error('Failed to update user');
  }
  return res.result;
};
export default function AccountGeneral(props: any) {
  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const { userData, bankName = [] } = props;

  const { defaultAvatar } = useDefaultAvatar();

  const handleChange = (event: SelectChangeEvent, index: number) => {
    setBankList((prevBankList) =>
      prevBankList.map((bank, i) => (i === index ? { ...bank, bankId: event.target.value } : bank))
    );
    setValue(`bankAccounts[${index}].bankId`, event.target.value);
  };

  const [phoneList, setPhoneList] = useState<any[]>(() =>
    userData?.phones && Array.isArray(userData?.phones) && userData?.phones.length > 0
      ? userData?.phones
      : [
          {
            phone: '',
            status: 2,
          },
        ]
  );

  const [bankList, setBankList] = useState<any[]>(() =>
    userData?.bankAccounts &&
    Array.isArray(userData?.bankAccounts) &&
    userData?.bankAccounts.length > 0
      ? userData?.bankAccounts
      : [
          {
            accountNo: 0,
            accountHolder: '',
            status: 2,
            bankId: 0,
          },
        ]
  );

  const [isEdit, setIsEdit] = useState(false);

  const [isEditImage, setEditImage] = useState(false);

  const { userCurrentRole } = useGetUserCurrentRole();

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Tên là bắt buộc'),
    middleName: Yup.string().required('Tên là bắt buộc'),
    lastName: Yup.string().required('Tên là bắt buộc'),
    email: Yup.string().required('Email là bắt buộc').email('Email phải là địa chỉ email hợp lệ'),
    phones: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().notRequired(),
        phone: Yup.string()
          .required('Số điện thoại là bắt buộc')
          .matches(/^[0-9]+$/, 'Số điện thoại chỉ được phép là chữ số'),
        status: Yup.number().notRequired(),
      })
    ),

    bankAccounts: Yup.array().of(
      Yup.object().shape({
        accountNo: Yup.number().required('Số điện thoại chỉ được phép là chữ số'),
        bankId: Yup.number().required('Bank is required'),
        accountHolder: Yup.string().required('Tên chủ thẻ là bắt buộc'),
        status: Yup.number().notRequired(),
        id: Yup.number().notRequired(),
      })
    ),
  });

  const defaultValues: any = {
    firstName: userData?.firstName,
    middleName: userData?.middleName,
    lastName: userData?.lastName,
    phones: phoneList,
    email: userData?.email,
    bankAccounts: bankList,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutate }: any = useMutation({
    mutationFn: (payload) => updateInfor(payload),
    onSuccess: () => {
      enqueueSnackbar('Cập nhật thành công!');
      setIsEdit(!isEdit);
    },
    onError: (error) => {
      toast.error('C  ập nhật lỗi');
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: UserInfor = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        phones: data.phones,
        bankAccounts: data.bankAccounts,
        email: data.email,
      };

      setEditImage(false);
      mutate(payload);
      queryClient.invalidateQueries(['userTest'] as any);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            {isEdit && isEditImage && (
              <RHFUploadAvatar
                name="photoURL"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            )}

            {isEditImage === false && (
              <>
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <Image
                    alt="cmm"
                    src={userData?.urlAvatar || defaultAvatar}
                    width={120}
                    height={120}
                    style={{ borderRadius: '80%', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {isEdit && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: { md: 100, xs: 180, sm: 40 },
                        width: { md: '37%', xs: '25%', sm: '64%' },
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền overlay
                        borderRadius: '50%',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                      }}
                      className="overlay"
                    >
                      <Button onClick={() => setEditImage(!isEditImage)}>
                        Thay đổi ảnh đại diện
                      </Button>
                    </Box>
                  )}
                </Box>
                <style>{`
  .overlay:hover {
      opacity: 1;
  }
`}</style>
              </>
            )}

            <Button variant="soft" color="success" sx={{ mt: 3 }}>
              {userCurrentRole}
            </Button>
            <Box sx={{ mt: 3, display: 'flex', width: '100%', justifyContent: 'center', gap: 2 }}>
              <span> Mã giới thiệu của bạn:</span>
              <Box>{userData?.referenceCode}</Box>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ py: 3 }}>Thông tin cá nhân</Typography>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 2fr)',
                sm: 'repeat(3, 2fr)',
              }}
            >
              <RHFTextField name="firstName" label="Tên" disabled={!isEdit} />
              <RHFTextField name="middleName" label="Tên đệm" disabled={!isEdit} />
              <RHFTextField name="lastName" label="Họ" disabled={!isEdit} />
              {userData?.phones &&
                phoneList.map((phone, index) => (
                  <RHFTextField
                    key={index}
                    name={`phones[${index}].phone`}
                    label={`Số điện thoại `}
                    disabled={!isEdit}
                    defaultValue={phone?.phone}
                  />
                ))}

              <RHFTextField name="email" label="Email" disabled={!isEdit} />
            </Box>
            <Typography sx={{ mt: 3 }}>Tài khoản ngân hàng</Typography>
            {bankList &&
              Array.isArray(bankList) &&
              bankList.map((item, index) => (
                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                  <RHFTextField
                    name={`bankAccounts[${index}].accountNo`}
                    rows={4}
                    label="Số tài khoản"
                    disabled={!isEdit}
                  />

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Age"
                    onChange={(e: any) => handleChange(e, index)}
                    fullWidth
                    value={bankList[index]?.bankId}
                    name={`bankAccounts[${index}].bankId`}
                    disabled={!isEdit}
                  >
                    {bankName &&
                      Array.isArray(bankName) &&
                      bankName.length > 0 &&
                      bankName.map((bank: any) => (
                        <MenuItem value={bank.id}>{bank?.vnName}</MenuItem>
                      ))}
                  </Select>
                  <RHFTextField
                    name={`bankAccounts[${index}].accountHolder`}
                    rows={4}
                    label="Chủ thẻ"
                    defaultValue={item.accountHolder}
                    disabled={!isEdit}
                  />
                </Stack>
              ))}

            <Stack
              spacing={3}
              alignItems="flex-end"
              display="flex"
              flexDirection="row-reverse"
              sx={{ mt: 3 }}
            >
              {isEdit && (
                <LoadingButton variant="contained" loading={isSubmitting} type="submit">
                  Lưu và thay đổi
                </LoadingButton>
              )}
              <LoadingButton
                variant="contained"
                onClick={() => {
                  setIsEdit(!isEdit);
                  setEditImage(isEditImage === false ? isEditImage : !isEditImage);
                }}
              >
                {isEdit ? 'Hủy bỏ' : 'Sửa'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
