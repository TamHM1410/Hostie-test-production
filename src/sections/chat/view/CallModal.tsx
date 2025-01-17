//  @hook
import * as React from 'react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card, FormControl, Avatar } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

//  @component
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';

//  @api
import { deleteRoleApi } from 'src/api/users';

import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const CallModal = (props: any) => {
  const [open, setOpen] = useState(false);


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
      // mutate(currentRole.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        open={false}
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
            width: 300,
            height: 430,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <FormControl onSubmit={onSubmit} sx={{ width: '100%' }}>
            <Grid md={12} xs={8} sx={{            border:0
}}>
            <Typography
                  id="modal-title"
                  variant="h4"
                  component="h2"
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  Cuộc gọi đến
                </Typography>
                <Box                   sx={{ display: 'flex', justifyContent: 'center',py:5 }}
                >
                <Avatar alt='nul'sx={{width:120 ,height:120}} src='https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/467842942_1114869786830913_3556190566644188708_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=G717WSePemcQ7kNvgGupHRg&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=AMqgA7IrxeRRBIHKtyCfAGu&oh=00_AYDOpWgaUrDU14n9gc37qUwu6o-iPt0MAs03QOmSwsqmbw&oe=67461DAD'/>

                </Box>
                <Box   sx={{ display: 'flex', justifyContent: 'center',pb:5 ,fontWeight:800}}>
                    Tam dep trai
                </Box>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="success"
                    type="submit"
                    // onClick={() => onSubmit()}
                    sx={{
                      gap:1
                    }}
                  >
                 <LocalPhoneIcon/>    Nghe
                  </LoadingButton>
                </Stack>
            </Grid>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default CallModal;
