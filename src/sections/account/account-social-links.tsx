import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
// types
import { IUserSocialLink } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { social_urls } from '../../types/users';

// ----------------------------------------------------------------------

type Props = {
  socialLinks: IUserSocialLink;
  socials:any
};

export default function AccountSocialLinks({ socialLinks ,socials}: Props) {
  const { enqueueSnackbar } = useSnackbar();


  console.log(socials,'social')


  const defaultValues = {
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    linkedin: socialLinks.linkedin,
    twitter: socialLinks.twitter,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });



  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
 

        {
          Array.isArray(socials) && socials.map((link)=>(
            <RHFTextField
            key={link}
            name={link?.url}
            defaultValue={link?.url}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    width={24}
                    icon={
                      (link?.socialName.toLowerCase() === 'facebook' && 'eva:facebook-fill') ||
                      (link?.socialName.toLowerCase() === 'linkedin' && 'eva:linkedin-fill') ||
                      (link?.socialName.toLowerCase()  === 'instagram' && 'ant-design:instagram-filled') ||
                      (link?.socialName.toLowerCase()  === 'twitter' && 'eva:twitter-fill') ||
                    
                      ''
                    }
                    color={
                      (link?.socialName.toLowerCase()  === 'facebook' && '#1877F2') ||
                      (link?.socialName.toLowerCase()  === 'instagram' && '#DF3E30') ||
                      (link?.socialName.toLowerCase()  === 'linkin' && '#006097') ||
                      (link?.socialName.toLowerCase()  === 'twitter' && '#1C9CEA') ||
                      ''
                    }
                  />
                </InputAdornment>
              ),
            }}
          />
          ))
        }

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
        Sửa
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
