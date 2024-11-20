'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// components
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function ContactForm() {
  const [form, setFormData] = useState({
    email: '',
    name: '',
    subject: '',
    content: '',
  });

  const handleSend=()=>{
    setTimeout(()=>{
      toast.success('Lời nhắn của bạn đã được gửi đến chúng tôi.Chúng tôi sẽ phản hồi sớm nhất!')
    },1000)
  

    setFormData({
      email: '',
      name: '',
      subject: '',
      content: '',
    })
  }

  return (
    <Stack component={MotionViewport} spacing={5}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h3">
          Hãy liên hệ với chúng tôi. <br />
          Chúng tôi rất vui khi được nghe tin từ bạn.
        </Typography>
      </m.div>

      <Stack spacing={3}>
        <m.div variants={varFade().inUp}>
          <TextField
            fullWidth
            label="Tên"
            value={form.name}
            onChange={(e) => setFormData({ ...form, name: e.target.value })}
          />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField
            fullWidth
            label="Email"
            value={form.email}
            onChange={(e) => setFormData({ ...form, email: e.target.value })}
          />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField
            fullWidth
            label="Tiêu đề"
            value={form.subject}
            onChange={(e) => setFormData({ ...form, subject: e.target.value })}
          />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField
            fullWidth
            label="Nhập tin nhắn của bạn ở đây."
            multiline
            rows={4}
            value={form.content}
            onChange={(e) => setFormData({ ...form, content: e.target.value })}
          />
        </m.div>
      </Stack>

      <m.div variants={varFade().inUp}>
        <Button size="large" variant="contained" onClick={handleSend} disabled={form.email && form.content && form.subject && form.content ? false :true}>
          Gửi ngay
        </Button>
      </m.div>
    </Stack>
  );
}
