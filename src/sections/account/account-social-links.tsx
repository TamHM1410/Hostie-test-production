import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
// types
import { IUserSocialLink } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

// ----------------------------------------------------------------------

type Props = {
  socialLinks: IUserSocialLink;
  socials: any[];
};

const SOCIAL_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
];

export default function AccountSocialLinks({ socialLinks, socials }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [isEdit, setIsEdit] = useState(false);

  const defaultValues = {
    listSocial: Array.isArray(socials) && socials.length > 0 
      ? socials 
      : [{ socialName: '', url: '', status: 2 }]
  };

  const methods = useForm({
    defaultValues,
  });

  const { control, handleSubmit, formState: { isSubmitting } } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'listSocial',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info('DATA', data);
      // Add your submission logic here
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  });

  const getIconBySocialName = (socialName: string) => {
    switch(socialName.toLowerCase()) {
      case 'facebook': return 'eva:facebook-fill';
      case 'linkedin': return 'eva:linkedin-fill';
      case 'instagram': return 'ant-design:instagram-filled';
      case 'twitter': return 'eva:twitter-fill';
      default: return '';
    }
  };

  const getColorBySocialName = (socialName: string) => {
    switch(socialName.toLowerCase()) {
      case 'facebook': return '#1877F2';
      case 'instagram': return '#DF3E30';
      case 'linkedin': return '#006097';
      case 'twitter': return '#1C9CEA';
      default: return '';
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={() => setIsEdit(!isEdit)}>
            <EditIcon />
          </IconButton>
        </Box>

        {fields.map((field, index) => (
          <Stack key={field.id} direction="row" spacing={2} alignItems="center">
            <RHFSelect
              name={`listSocial.${index}.socialName`}
              label="Mạng xã hội"
              sx={{ width: '200px' }}
              disabled={!isEdit}
            >
              {SOCIAL_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField
              name={`listSocial.${index}.url`}
              label="Địa chỉ liên kết"
              fullWidth
              disabled={!isEdit}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      width={24}
                      icon={getIconBySocialName(field.socialName)}
                      color={getColorBySocialName(field.socialName)}
                    />
                  </InputAdornment>
                ),
              }}
            />
            {isEdit && index > 0 && (
              <IconButton onClick={() => remove(index)} color="error">
                <Iconify icon="mdi:close" />
              </IconButton>
            )}
          </Stack>
        ))}
        
        {isEdit && (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={() => append({ socialName: '', url: '', status: 2 })}>
              <AddIcon />
            </IconButton>

            <LoadingButton 
              type="submit" 
              variant="contained" 
              loading={isSubmitting} 
              sx={{ ml: 'auto' }}
            >
              Lưu
            </LoadingButton>
          </Box>
        )}
      </Stack>
    </FormProvider>
  );
}