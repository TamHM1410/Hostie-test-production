import { useState } from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import ReviewImageModal from './previewImageModal';


export default function FileMessage({ files = [] }: any) {


  const [open,setOpen]=useState(false)
  const [currentImage,setCurrentImage]=useState<any>(null)

  const handleClick=(value:any)=>{
    setOpen(!open)
    setCurrentImage(value)
  }
  const render_file = files.map((file: any) => {
    if (file?.file_type === 'image') {
      return (
        <Box sx={{py:0.5 }} onClick={()=>handleClick(file?.file_name)}>
          <Image src={file?.file_name && (file.file_name.endsWith('png') ||file.file_name.endsWith('jpeg')) ? `https://hostie-image.s3.ap-southeast-2.amazonaws.com/chat/${file?.file_name}` : file?.file_name}
           alt="This fail to load" width={70} height={70} style={{borderRadius:5}}  loading='lazy' />
         <ReviewImageModal open={open} setOpen={setOpen} currentImage={currentImage}/>
        </Box>
     
      );
    }
    if(file?.file_type==='doc'){
      return (<Box  sx={{ position: 'relative' }}>
        <Box sx={{ padding: 0.5, backgroundColor: '#e0e0e0', borderRadius: 1
           ,mx:1.2,height:90 ,width:180 ,whiteSpace:'nowrap',overflow:'hidden'
           ,textOverflow:' ellipsis',display:'flex',alignItems:'center',fontSize:18}}>
          <InsertDriveFileIcon /> <span >{ file?.thumb_name}</span>
        </Box>
        
      </Box>)
    }
  });
  return <>{render_file}</>;
}
