//  @hook
import * as React from 'react';
import { useCurrentRole ,useCurrentUser} from 'src/zustand/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//  @mui
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack, Card, FormControl } from '@mui/material';
import { updateUserActive } from 'src/api/users';

//  @component
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';

//  @apiU

const useUpdateActiveModal = ({ open, setOpen ,type}: any) => {

  const {currenUserSelected} =useCurrentUser()

  const {currentRole}=useCurrentRole()
  
  const current =React.useMemo(()=> {
    if(type==='user') return currenUserSelected
    if(type==='role') return currentRole
    return null

  },[currenUserSelected,type,currentRole])

  const { mutate}:any = useMutation({
    mutationFn:(payload:any)=>{
      switch(type){
        case 'user': return updateUserActive(payload?.id,payload?.isActive)
        // case 'role':
        default :return  updateUserActive(payload?.id,payload?.isActive)
      }
      
    },
    onSuccess: () => {
      toast.success('Đã cập nhật')
      queryClient.invalidateQueries(['usersList'] as any);
      setOpen(!open)

      
    },
    onError:(error)=>{

      toast.error('Cập nhật thất bại')

    }
  })
  
  const queryClient = useQueryClient();

  const onSubmit = async () => {
    try {

       const payload = {
         id:current?.id,
         isActive:!current?.isActive
       }
       mutate(payload)
    } catch (error) {
    }
  };

  return (
    
      
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{animationDuration:100}}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 270,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Bạn có chắc muốn thay đổi trạng thái của người dùng này không?
          </Typography>
          <FormControl onSubmit={onSubmit} sx={{ width: '100%' }}>
            <Grid item md={12} xs={8}>
              <Card sx={{ p: 3, mt: 2 }}>
                <Typography sx={{ width: '100%' }}>
                  {' '}
                  Hành động này có thể ảnh hưởng đến{' '}
                  <span style={{ fontWeight: 700 }}>Người dùng</span>
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button variant="contained" onClick={() => setOpen(false)}>
                  Hủy bỏ
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
    
  );
};

export default useUpdateActiveModal;
