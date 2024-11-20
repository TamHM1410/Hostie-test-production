//  @hook
import * as React from 'react';
import { useState } from 'react';
import { useCurrentRole } from 'src/zustand/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card, FormControl } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


//  @component
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';

//  @api
import { deleteRoleApi } from 'src/api/users';



const DeleteRoleModal = (props: any) => {

  const [open, setOpen] = useState(false);

  const { currentRole } = useCurrentRole();

  const queryClient = useQueryClient();

  const { mutate }: any = useMutation({
    mutationFn: (payload: any) => deleteRoleApi(payload),
    onSuccess: () => {
      setOpen(!open);
      toast.success('Deleted success');
      queryClient.invalidateQueries(['roleList'] as any);
    },
    onError: (error) => {
      toast.error('Error');
    },
  });


  const onSubmit = async () => {
    try {
      mutate(currentRole.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ gap: 2,width:130  }}>
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
            width: 500,
            height: 230,
            bgcolor: 'background.paper',
            borderRadius:2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
           Bạn có chắc muốn xóa role này?
          </Typography>
          <FormControl onSubmit={onSubmit} sx={{ width: '100%' }}>
            <Grid md={12} xs={8}>
              <Card sx={{ p: 3, mt: 2 }}>
               
                <Typography sx={{ width: '100%' }}> Hành động này không thể lặp lại.</Typography>

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

export default DeleteRoleModal;
