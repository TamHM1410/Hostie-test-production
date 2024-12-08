import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Box, Modal, Typography, Grid, Card, Stack, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { termsOfService } from 'src/utils/privacy';



const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const PriacyModal = ({ open, setOpen }: any) => {
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
            width: 500,
            height: 'auto',
            // maxHeight:500,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Điều khoản và dịch vụ
          </Typography>

          <Grid md={12} xs={8}>
            <Card sx={{ p: 3, mt: 2 ,maxHeight :400,      overflow:'scroll'}}>
              {
                Array.isArray(termsOfService) && termsOfService.map((item:any,index:number)=>{
                  return (
                    <Box sx={{ width: '100%' }} key={index}>
                    <Typography sx={{ width: '100%' }} variant='h6'> {item?.id}.{item?.title}</Typography>
                    <Typography sx={{fontSize:12,py:1}}>
                      {item?.content}
                    </Typography>
      
      
                    </Box>

                  )
                })
              }
             
            
              
             
             
            </Card>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={() => setOpen(false)}
                >
                  Xác nhận
                </LoadingButton>
              </Stack>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
const RegisterPrivacy = ({ isChecked, setIsChecked,reset ,methods }: any) => {
  const [openPrivacy, setOpenPrivacy] = useState(false);


  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        <Checkbox
          {...label}
          checked={isChecked}
          onChange={() =>{
            if(!isChecked){
              setOpenPrivacy(true)

            }
            setIsChecked(!isChecked)
            methods.setValue('isChecked',!isChecked)
          
          
          } } // Đảm bảo sử dụng đúng hàm setIsChecked
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'black', // Màu mặc định
            cursor: 'pointer', // Hiển thị con trỏ pointer
            '&:hover': {
              color: 'blue', // Màu xanh khi hover
              textDecoration: 'underline', // Gạch chân khi hover
            },
          }}
          onClick={() => setOpenPrivacy(!openPrivacy)}
        >
          Tôi đồng ý với các điều khoản và dịch vụ
        </Box>
      </Box>
      <PriacyModal open={openPrivacy} setOpen={setOpenPrivacy} />
    </>
  );
};
export default RegisterPrivacy;
