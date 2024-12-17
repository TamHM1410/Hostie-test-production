import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useCurrentResidenceType } from 'src/zustand/store';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { delete_residence_type } from 'src/api/residence';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const DeleteResidenceTypeModal = (props: any) => {
  const [open, setOpen] = useState(false);
  const { currentResidenceType } = useCurrentResidenceType();
  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn: (payload: any) => delete_residence_type(payload),
    onSuccess: () => {
      setOpen(!open);
      toast.success('Deleted success');
      queryClient.invalidateQueries(['amenityList'] as any);
    },
    onError: (error) => {
      toast.error('Error');
    },
  });

  const onSubmit = async () => {
    try {
      mutate(currentResidenceType.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2, width: 130,color:'red' }}>
        <DeleteOutlineIcon /> Xóa
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
            minWidth:{xs:300, md:500,lg:800},
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
           Bạn có chắc muốn xóa?
          </Typography>
          <FormControl onSubmit={onSubmit} sx={{ width: '100%' }}>
            <Grid md={12} xs={8}>
              <Card sx={{ p: 3, mt: 2 }}>
                <Box
                  rowGap={3}
                  columnGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(0, 1fr)',
                    sm: 'repeat(0, 1fr)',
                  }}
                ></Box>
                <Typography sx={{ width: '100%' }}> Hành động này không thể thự hiện lại.</Typography>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Hủy 
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="error"
                    type="submit"
                    onClick={() => onSubmit()}
                  >
                    Xác nhận
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteResidenceTypeModal;
