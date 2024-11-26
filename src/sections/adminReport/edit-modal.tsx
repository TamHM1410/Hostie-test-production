import * as React from 'react';
import {
  Button,
  Modal,
  Typography,
  Box,
  Grid,
  Stack,
  Card,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateReport } from 'src/api/report';

const EditReportModal = (props: any) => {
  const { open, setOpen, selectEdit } = props;

  const [status, setStatus] = React.useState(selectEdit?.status || 'PENDING');

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({payload,id}:{payload:any,id:any}) => updateReport(payload,id),
    onSuccess: () => {
      setOpen(false);
      toast.success('Cập nhật thành công');
      queryClient.invalidateQueries(['reportList'] as any);
      reset();
    },
    onError: () => {
      toast.error('Đã xảy ra lỗi');
    },
  });

  const UpdateReportSchema = Yup.object().shape({
    status: Yup.string().notRequired(),
    adminNote: Yup.string().required('Bạn cần nhập ghi chú'),
    id: Yup.number().notRequired(),
  });

  const defaultValues: any = {
    id: selectEdit?.id,
    status: selectEdit?.status || 'PENDING',
    adminNote: selectEdit?.adminNote || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateReportSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
    reset({ ...methods.getValues(), status: event.target.value });
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = { adminNote:data?.adminNote,
        status:data?.status
       };
       const id =data?.id
      console.log(payload, 'payload');
      mutate({payload,id});
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (selectEdit) {
      reset({
        id: selectEdit?.id,
        status: selectEdit?.status || 'PENDING',
        adminNote: selectEdit?.adminNote || '',
      });
    }
  }, [selectEdit, reset]);

  return (
    <>
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
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Chỉnh sửa báo cáo
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ p: 3, mt: 2 }}>
                  <Box
                    rowGap={3}
                    columnGap={3}
                    display="grid"
                    gridTemplateColumns={{
                      xs: '1fr',
                      sm: '1fr',
                    }}
                  >
                    <RHFTextField name="adminNote" label="Ghi chú" />
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id="select-status-label">Trạng thái</InputLabel>
                        <Select
                          labelId="select-status-label"
                          id="select-status"
                          value={status}
                          onChange={handleChange}
                          label="Trạng thái"
                        >
                          <MenuItem value="INVESTIGATING">Điều tra</MenuItem>
                          <MenuItem value="PENDING"> Chờ xử lý</MenuItem>
                          <MenuItem value="RESOLVED" >Đã giải quyết</MenuItem>

                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={() => setOpen(false)}>
                      Hủy
                    </Button>
                    <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                      Lưu và thay đổi
                    </LoadingButton>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
};

export default EditReportModal;
