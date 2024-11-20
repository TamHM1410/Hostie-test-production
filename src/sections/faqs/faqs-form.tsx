import { m } from 'framer-motion';
import { useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
//
import { varFade, MotionViewport } from 'src/components/animate';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

export default function FaqsForm() {

  const [form,setForm]=useState({
    name:'',
    email:'',
    subject:'',
    message:''
  })
  
  const handleClick=()=>{

    toast.success('Gửi thành công')
    setForm({
      name:'',
      email:'',
      subject:'',
      message:''
    })

  }

  return (
    <Stack component={MotionViewport} spacing={3}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h4">Bạn vẫn chưa tìm được sự trợ giúp phù hợp?</Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Tên" onChange={(e)=>setForm({...form,name:e.target.value})}  value={form.name}/>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Email" onChange={(e)=>setForm({...form,email:e.target.value})}  value={form.email}/>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Chủ đề" onChange={(e)=>setForm({...form,subject:e.target.value})}  value={form.subject}/>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Nhập tin nhắn của bạn vào đây." multiline rows={4} onChange={(e)=>setForm({...form,message:e.target.value})}  value={form.message} />
      </m.div>

      <m.div variants={varFade().inUp}>
        <Button size="large" variant="contained" onClick={handleClick} disabled={form.name && form.email && form.subject && form.message ? false :true}>
          Gửi ngay
        </Button>
      </m.div>
    </Stack>
  );
}
