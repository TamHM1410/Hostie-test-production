import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCurrentAmenity } from 'src/zustand/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateAmenityApi } from 'src/api/amenity';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Image from 'next/image';
import { Edit } from '@mui/icons-material';
import { AmenityFormType } from 'src/types/amenity';
import { Upload } from 'src/components/upload';

const EditAmenityModal = () => {
  const { currentAmenity } = useCurrentAmenity();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentAmenity?.status);
  const [type, setType] = useState(currentAmenity?.iconType);
  const [file, setFile] = useState<File | string | any>(null);
  const [changeFile, setChangeFile] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: any) => updateAmenityApi({ id, payload }),
    onSuccess: () => {
      setOpen(false);
      toast.success('Update success');
      queryClient.invalidateQueries(['amenityList'] as any);
      reset();
    },
    onError: (error) => {
      toast.error('Error');
      console.log(error);
    },
  });

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    iconSize: Yup.string().required('Size is required'),
    iconPath: Yup.string().required('Path is required'),
  });

  const defaultValues: AmenityFormType | any = {
    name: currentAmenity?.name || '',
    status: currentAmenity?.status || 0,
    iconPath: currentAmenity?.iconPath || '',
    iconType: currentAmenity?.iconType || '',
    iconSize: currentAmenity?.iconSize || '',
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

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };
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

  const onSubmit = async (data: any) => {
    try {
      const id = currentAmenity?.id;

      const amenityUpdateRequest: any = {
        name: data?.name,
        status: status,
      };

      if (file) {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('amenityUpdateRequest', amenityUpdateRequest);
        mutation.mutate({ id, payload: formData });
      }

      const payload = {
        file: file,
        amenityUpdateRequest: amenityUpdateRequest,
      };

      mutation.mutate({ id, payload });
    } catch (error) {
      console.error(error, 'err');
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2, width: 130 ,display:'flex'}}>
        <Edit /> Sửa
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
            width: 800,
            height: 630,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflowY:'scroll'
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Sửa
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
                  <RHFTextField name="name" label="Name" />
                  <RHFTextField name="iconSize" label="Size" />
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="type-select-label">Type</InputLabel>
                      <Select
                        labelId="type-select-label"
                        id="type-select"
                        value={type}
                        label="Type"
                        onChange={handleChangeType}
                      >
                        <MenuItem value={'png'}>PNG</MenuItem>
                        <MenuItem value={'jpg'}>JPG</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="status-select-label">Trạng thái</InputLabel>
                      <Select
                        labelId="status-select-label"
                        id="status-select"
                        value={status}
                        label="Status"
                        onChange={handleChangeStatus}
                      >
                        <MenuItem value={0}>Từ chối</MenuItem>
                        <MenuItem value={1}>Xét duyệt</MenuItem>
                        <MenuItem value={2}>Chấp thuận</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 10 }}>
                    <Image src={watch('iconPath')} alt="Icon Preview" width={50} height={50} />
                    <RHFTextField name="iconPath" label="Current Icon path" disabled />
                  </Box>

                  <Button onClick={() => setChangeFile(!changeFile)}>
                    {changeFile == false ? 'Or upload new icon' : 'Show less'}
                  </Button>

                  {changeFile == true && (
                    <Box>
                      <Upload
                        multiple={false}
                        onDrop={handleDropSingleFile}
                        file={file}
                        onDelete={() => setFile(null)}
                      />
                    </Box>
                  )}
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

export default EditAmenityModal;
