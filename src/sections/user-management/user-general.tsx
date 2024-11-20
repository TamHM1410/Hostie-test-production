import * as Yup from 'yup';
import { useCallback, useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentUser } from 'src/zustand/store';
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
// assets
import Image from 'next/image'; // components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { updateUserById, getUserInfor } from 'src/api/users';
// ----------------------------------------------------
import { useMutation, useQuery } from '@tanstack/react-query';
/// type
import { UserInfor, BankAccount } from 'src/types/users';
import toast from 'react-hot-toast';
import UserSocial from './user-social';

///

//------------------
const updateInfor = async (payload: any) => {
  const res = await updateUserById(payload);
  
  if (!res) {
    throw new Error('Failed to update user');
  }
  return res.result;
};



export default function UserGeneral(props: any) {
  const { enqueueSnackbar } = useSnackbar();

  const { userData ,open,setOpen } = props;

  const {currenUserSelected}=useCurrentUser()

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => getUserInfor(),
  });

  const [bankList, setBankList] = useState<BankAccount[]>([
    {
      accountNo: 0,
      bank: 'dss',
      accountHolder: 'sdsd',
    },
  ]);

  const [phoneList, setPhoneList] = useState<string[]>(['']);
  const [isEdit, setIsEdit] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('Name is required'),
    middleName: Yup.string().required('Name is required'),
    lastName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phones: Yup.array()
      .of(
        Yup.string()
          .required('Phone number is required')
          .matches(/^[0-9]+$/, 'Phone number must contain only digits') // Chỉ cho phép số
      )
      .required('At least one phone number is required') // Mảng không được rỗng
      .min(1, 'At least one phone number is required'), // Ít nhất một số điện thoại

    bankAccounts: Yup.array()
      .of(
        Yup.object().shape({
          accountNo: Yup.number().required('Account number is required'),
          bank: Yup.string().required('Bank is required'),
          accountHolder: Yup.string().required('accountHolder is required'),
        })
      )
      .min(1, 'At least one social URL is required'),
  });

  const defaultValues: UserInfor | any = {
    firstName: currenUserSelected?.firstName,
    middleName: currenUserSelected?.middleName,
    lastName: currenUserSelected?.lastName,
    phones: phoneList,
    email: currenUserSelected?.email,
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
      enqueueSnackbar('Update success!');
      setIsEdit(!isEdit);
    },
    onError: (error) => {
      console.log('The mutation is fall!', error);

      toast.error('Update error');
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
      mutate(payload);
    } catch (error) {
      console.error(error);
    }
  });

//   console.log(currenUserSelected,'cureent')

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
        
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Image
                  alt="cmm"
                  src={currenUserSelected?.urlAvatar ===null ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyIhfGUExJgZR3U14lrHjfQffv7uu3jgtAOA&s' :currenUserSelected?.urlAvatar }
                  width={120}
                  height={120}
                  style={{ borderRadius: 80 }}
                />
              </Box>
            

            <Button variant="soft" color="success" sx={{ mt: 3 }}>
              {currenUserSelected?.username}
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ py: 3 }}>User Infor</Typography>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 2fr)',
                sm: 'repeat(3, 2fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" disabled={!isEdit} />
              <RHFTextField name="middleName" label="Middle Name" disabled={!isEdit} />
              <RHFTextField name="lastName" label="Last Name" disabled={!isEdit} />
              {phoneList.map((phone, index) => (
                <RHFTextField
                  key={index}
                  name={`phones[${index}]`}
                  label={`Phone ${index + 1}`}
                  disabled={!isEdit}
                />
              ))}

              <RHFTextField name="email" label="Email" disabled={!isEdit} />
            </Box>
            <Typography sx={{ mt: 3 }}>Bank Account</Typography>
            {bankList.map((item, index) => {
              return (
                <>
                  <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                    <RHFTextField
                      name={`accountNo[${index}]`}
                      rows={4}
                      label={'Bank Account Number'}
                      defaultValue={item.accountNo}
                      disabled={isEdit == true ? false : true}
                    />
                    <RHFTextField
                      name={`bank[${index}]`}
                      rows={4}
                      label="Bank "
                      defaultValue={item.bank}
                      disabled={isEdit == true ? false : true}
                    />
                    <RHFTextField
                      name={`accountHolder[${index}]`}
                      rows={4}
                      label="Account holder "
                      defaultValue={item.accountHolder}
                      disabled={isEdit == true ? false : true}
                    />
                  </Stack>
                </>
              );
            })}
            
            <Stack
              spacing={3}
              alignItems="flex-end"
              display="flex"
              flexDirection="row-reverse"
              sx={{ mt: 3 }}
            >
              {isEdit && (
                <LoadingButton variant="contained" loading={isSubmitting} type="submit">
                  Save Changes
                </LoadingButton>
              )}
              
             
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                onClick={() => setIsEdit(!isEdit)}
              >
                {isEdit ? ' Hủy bỏ' : 'Sửa'}
              </LoadingButton>
              {!isEdit && (
                <LoadingButton variant="contained" onClick={()=>setOpen(!open)}>
                 Trở về
                </LoadingButton>
              )}
             
            
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
