import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUserManagement } from 'src/api/useUserManagement';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// hooks
// utils
import { fData } from 'src/utils/format-number';
// assets
import Image from 'next/image';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';
import { Plus as PlusIcon, Trash as TrashIcon } from 'lucide-react';

import LoadingButton from '@mui/lab/LoadingButton';
// ----------------------------------------------------
import { useMutation, useQuery } from '@tanstack/react-query';
/// type
import { UserInfor } from 'src/types/users';
import { useDefaultAvatar } from 'src/hooks/use-avatar';
import Textfield from '../_examples/mui/textfield-view/textfield';

import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import ReferralCommissionTable from './referral-commission-table';

export default function AccountGeneral(props: any) {
  const { updateUserInfo, getReferredAccount, getTotalCommissionPackage } = useUserManagement();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { userData, bankName = [] ,referListData=[],totalCommission=0} = props;

  console.log('ref:',referListData ,'total commission',totalCommission)
  const { defaultAvatar } = useDefaultAvatar();
  const {data:session}=useSession()

  const [phoneList, setPhoneList] = useState<any[]>(() =>
    userData?.phones && Array.isArray(userData?.phones) && userData?.phones.length > 0
      ? userData?.phones
      : [{ phone: '', status: 2 }]
  );

  const [bankList, setBankList] = useState<any[]>(() =>
    userData?.bankAccounts &&
    Array.isArray(userData?.bankAccounts) &&
    userData?.bankAccounts.length > 0
      ? userData?.bankAccounts
      : [{ accountNo: 0, accountHolder: '', status: 2, bankId: 0 }]
  );

  const [visibleBanks, setVisibleBanks] = useState(2);
  const [isShowingAll, setIsShowingAll] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditImage, setEditImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


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
        accountNo: Yup.number().required('Số tài khoản là bắt buộc'),
        bankId: Yup.number().required('Ngân hàng là bắt buộc'),
        accountHolder: Yup.string().required('Tên chủ thẻ là bắt buộc'),
        status: Yup.number().notRequired(),
        id: Yup.number().notRequired(),
      })
    ),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: {
      firstName: userData?.firstName,
      middleName: userData?.middleName,
      lastName: userData?.lastName,
      phones: phoneList,
      email: userData?.email,
      bankAccounts: bankList,
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = methods;

  const handleAddPhone = () => {
    const currentPhones = getValues('phones') || [];
    setValue('phones', [...currentPhones, { phone: '', status: 2 }]);
    setPhoneList((prev) => [...prev, { phone: '', status: 2 }]);
  };

  const handleRemovePhone = (index: number) => {
    const currentPhones = getValues('phones');
    const updatedPhones = currentPhones.filter((_: any, i: number) => i !== index);
    setValue('phones', updatedPhones);
    setPhoneList(updatedPhones);
  };

  const handleAddBank = () => {
    const currentBanks = getValues('bankAccounts') || [];
    setValue('bankAccounts', [...currentBanks, { accountNo: 0, accountHolder: '', status: 2, bankId: 0 }]);
    setBankList((prev) => [...prev, { accountNo: 0, accountHolder: '', status: 2, bankId: 0 }]);
  };

  const handleRemoveBank = (index: number) => {
    const currentBanks = getValues('bankAccounts');
    const updatedBanks = currentBanks.filter((_: any, i: number) => i !== index);
    setValue('bankAccounts', updatedBanks);
    setBankList(updatedBanks);
  };

  const handleChange = (event: SelectChangeEvent, index: number) => {
    setBankList((prevBankList) =>
      prevBankList.map((bank, i) => (i === index ? { ...bank, bankId: event.target.value } : bank))
    );
    setValue(`bankAccounts[${index}].bankId`, event.target.value);
  };

  const toggleShowMore = () => {
    if (isShowingAll) {
      setVisibleBanks(2);
    } else {
      setVisibleBanks(bankList.length);
    }
    setIsShowingAll(!isShowingAll);
  };

  const { mutate }: any = useMutation({
    mutationFn: (payload) => updateUserInfo(payload),
    onSuccess: () => {
      enqueueSnackbar('Cập nhật thành công!');
      setIsEdit(!isEdit);
      setIsLoading(false)
    },
    onError:()=>      setIsLoading(false)

  });



  
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true)

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
      setIsLoading(false)
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
                    alt="avatar"
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
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              {session?.user?.roles === "HOST" && "Chủ nhà"}
              {session?.user?.roles === "SELLER" && "Môi giới"}
              {session?.user?.roles === "HOUSEKEEPER" && "Người quản gia"}
              {session?.user?.roles === "ADMIN" && "Quản trị viên"}
            </Button>

           
         <ReferralCommissionTable referListData={referListData} 
  totalCommission={totalCommission}/>
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
            </Box>

            <Typography sx={{ mt: 3 }}>Số điện thoại</Typography>
            {phoneList.map((phone, index) => (
              <Stack key={index} direction="row" spacing={2} sx={{ mt: 2 }}>
                <RHFTextField
                  name={`phones[${index}].phone`}
                  label={`Số điện thoại ${index + 1}`}
                  disabled={!isEdit}
                  fullWidth
                />
                {isEdit && phoneList.length > 1 && (
                  <IconButton onClick={() => handleRemovePhone(index)} color="error">
                    <TrashIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
            {isEdit && (
              <Button
                startIcon={<PlusIcon />}
                onClick={handleAddPhone}
                sx={{ mt: 2 }}
                variant="outlined"
              >
                Thêm số điện thoại
              </Button>
            )}

            <RHFTextField name="email" label="Email" disabled={!isEdit} sx={{ mt: 3 }} />

            <Typography sx={{ mt: 3 }}>Tài khoản ngân hàng</Typography>
            {bankList.slice(0, visibleBanks).map((item, index) => (
              <Stack key={index} spacing={3} sx={{ mt: 3 }}>
                <Stack direction="row" spacing={2}>
                  <Box flex={1}>
                    <RHFTextField
                      name={`bankAccounts[${index}].accountNo`}
                      label="Số tài khoản"
                      disabled={!isEdit}
                    />

                    <Select
                      labelId={`bank-select-${index}`}
                      value={bankList[index]?.bankId}
                      onChange={(e) => handleChange(e, index)}
                      fullWidth
                      disabled={!isEdit}
                      sx={{ mt: 2 }}
                    >
                      {bankName.map((bank: any) => (
                        <MenuItem key={bank.id} value={bank.id}>
                          {bank?.vnName}
                        </MenuItem>
                      ))}
                    </Select>

                    <RHFTextField
                      name={`bankAccounts[${index}].accountHolder`}
                      label="Chủ thẻ"
                      disabled={!isEdit}
                      sx={{ mt: 2 }}
                    />
                  </Box>
                  {isEdit && bankList.length > 1 && (
                    <IconButton onClick={() => handleRemoveBank(index)} color="error">
                      <TrashIcon />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            ))}

            {isEdit && (
              <Button
                startIcon={<PlusIcon />}
                onClick={handleAddBank}
                sx={{ mt: 2 }}
                variant="outlined"
                >
                Thêm tài khoản ngân hàng
              </Button>
            )}

            {bankList.length > 2 && (
              <Button
                onClick={toggleShowMore}
                sx={{
                  mt: 2,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isShowingAll ? 'Ẩn bớt' : `Xem thêm (${bankList.length - 2})`}
              </Button>
            )}

            <Stack
              spacing={3}
              alignItems="flex-end"
              display="flex"
              flexDirection="row-reverse"
              sx={{ mt: 3 }}
            >
              {isEdit && (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Lưu thay đổi
                </LoadingButton>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  setIsEdit(!isEdit);
                  setEditImage(isEditImage === false ? isEditImage : !isEditImage);
                  // Reset form to initial values when canceling
                  if (isEdit) {
                    methods.reset({
                      firstName: userData?.firstName,
                      middleName: userData?.middleName,
                      lastName: userData?.lastName,
                      phones: userData?.phones || [{ phone: '', status: 2 }],
                      email: userData?.email,
                      bankAccounts: userData?.bankAccounts || [{ accountNo: 0, accountHolder: '', status: 2, bankId: 0 }],
                    });
                    setPhoneList(userData?.phones || [{ phone: '', status: 2 }]);
                    setBankList(userData?.bankAccounts || [{ accountNo: 0, accountHolder: '', status: 2, bankId: 0 }]);
                  }
                }}
              >
                {isEdit ? 'Hủy bỏ' : 'Chỉnh sửa'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}