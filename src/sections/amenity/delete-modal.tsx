import * as React from 'react';
//  @hook
import { useState } from 'react';
import { useCurrentAmenity } from 'src/zustand/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAmenity } from 'src/api/useAmenity';
//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Grid, Stack, Card, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const DeleteAmentityModal = (props: any) => {
  const { deleteAmenity } = useAmenity();
  const [open, setOpen] = useState(false);
  const { currentAmenity } = useCurrentAmenity();
  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn: (payload: any) => deleteAmenity(payload),
    onSuccess: () => {
      setOpen(!open);
      queryClient.invalidateQueries(['amenityList'] as any);
    },
  });

  const onSubmit = async () => {
    try {
      mutate(currentAmenity.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ gap: 2, width: 130, color: 'red' }}
      >
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
            width:'auto',
            height: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Bạn có chắc muốn xóa
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
                <Typography sx={{ width: '100%' }}> Hành động này không thể lặp lại</Typography>

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
                    Xóa
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

export default DeleteAmentityModal;
