import { useFormContext, Controller } from 'react-hook-form';
import { useSession } from 'next-auth/react';
// @mui
import FormHelperText from '@mui/material/FormHelperText';

/// api
import { updateAvatar } from 'src/api/users';
import { useQueryClient } from '@tanstack/react-query';


//
import { UploadAvatar, Upload, UploadBox, UploadProps } from '../upload';


// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  multiple?: boolean;
}

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }: Props) {
  const { control } = useFormContext();
  const {data:session}=useSession()
  const queryClient = useQueryClient();

  
  const uploadAvatar=async (payload:any)=>{
    const file=new FormData()
    file.append('file',payload)
    file.append('userId',session?.user.id ?? '')
   await updateAvatar(file)
   queryClient.invalidateQueries(['userTest'] as any)
  }


  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        uploadAvatar(field.value)
        return (<div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>)
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            multiple
            accept={{ 'image/*': [] }}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{ 'image/*': [] }}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  );
}
