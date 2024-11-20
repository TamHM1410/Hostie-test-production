//  @hook
import * as React from 'react';

//  @mui
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Image from 'next/image';
//  @component

const ReviewImageModal = (props: any) => {

    const {open,setOpen,currentImage}=props

  return (

     
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
            width: 'fit-content',
            height:'fit-content',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            p: 0.5,
          }}
        >
         
         <Image src={currentImage && (currentImage.endsWith('png')||currentImage.endsWith('jpeg'))  ?`https://hostie-image.s3.ap-southeast-2.amazonaws.com/chat/${currentImage}` :currentImage}
           alt="This fail to load" width={400} height={400} style={{borderRadius:5}}  />
      
        </Box>
      </Modal>
  
  );
};

export default ReviewImageModal;
