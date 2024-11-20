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
import { useCurrentUser } from '../../zustand/store';

// ----------------------------------------------------------------------

type Props = {
  socialLinks: IUserSocialLink;
};

export default function UserSocial({ socialLinks }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { currenUserSelected } = useCurrentUser();

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
        {currenUserSelected?.socials &&
          Array.isArray(currenUserSelected.socials) &&
          currenUserSelected.socials.length > 0 &&
          currenUserSelected.socials.map((social:any) => {
            const socialLowerCase = typeof social?.socialName === 'string' ? social?.socialName.toLowerCase() : '';
            const name =typeof social?.url=== 'string' ? social?.url.toLowerCase() : '';


            return (
              <RHFTextField
                key={socialLowerCase}
                name={name}
                defaultValue={name
                  
                }
                aria-readonly
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        width={24}
                        icon={
                          (socialLowerCase === 'facebook' && 'eva:facebook-fill') ||
                          (socialLowerCase === 'instagram' && 'ant-design:instagram-filled') ||
                          (socialLowerCase === 'linkedin' && 'eva:linkedin-fill') ||
                          (socialLowerCase === 'twitter' && 'eva:twitter-fill') ||
                          ''
                        }
                        color={
                          (socialLowerCase === 'facebook' && '#1877F2') ||
                          (socialLowerCase === 'instagram' && '#DF3E30') ||
                          (socialLowerCase === 'linkedin' && '#006097') ||
                          (socialLowerCase === 'twitter' && '#1C9CEA') ||
                          ''
                        }
                      />
                    </InputAdornment>
                  ),
                }}
              />
            );
          })}

   

        {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton> */}
      </Stack>
    </FormProvider>
  );
}
