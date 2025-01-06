import * as React from 'react';
import * as Yup from 'yup';

//  @hook
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentAmenity } from 'src/zustand/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAmenity } from 'src/api/useAmenity';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { Grid, Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SelectChangeEvent } from '@mui/material/Select';
import { AmenityFormType } from 'src/types/amenity';
import { Upload } from 'src/components/upload';

const AddNewModal = () => {
  const { createNewAmenity } = useAmenity();
  const { currentAmenity } = useCurrentAmenity();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentAmenity?.status);
  const [type, setType] = useState(currentAmenity?.iconType);
  const [file, setFile] = useState<File | string | any>(null);

  const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: any) => createNewAmenity(payload),
    onSuccess: () => {
      setOpen(false);

      queryClient.invalidateQueries(['amenityList'] as any);

      reset();
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues: AmenityFormType | any = {
    name: '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues); // Reset form khi currentAmenity thay đổi
  }, [currentAmenity, reset]);

  const onSubmit = async (data: any) => {
    try {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('name', data.name);
      let id = currentAmenity?.id; // Lấy ID từ currentAmenity
      let payload = formData;
      mutation.mutate(payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2 }}>
        <AddIcon />
        Thêm mới tiện ích
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            height: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Thêm mới tiện ích
          </Typography>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid md={12} xs={8}>
              <Card sx={{ p: 3, mt: 2 }}>
                <Box
                  rowGap={3}
                  columnGap={3}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <Upload
                    multiple={false}
                    onDrop={handleDropSingleFile}
                    file={file}
                    onDelete={() => setFile(null)}
                  />
                  <RHFTextField name="name" label="Tên" />
                </Box>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                    Lưu & thay đổi
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
};

export default AddNewModal;
