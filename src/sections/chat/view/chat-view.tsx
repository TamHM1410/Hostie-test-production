'use client';

// @mui

import Container from '@mui/material/Container';
// routes
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks

import { useSettingsContext } from 'src/components/settings';
// types
//
;
import { socket } from 'src/utils/socketIo';
import Chat from './render-message';
import CallModal from './CallModal';
// ----------------------------------------------------------------------

export default function ChatView() {
  const router = useRouter();


  const settings = useSettingsContext();



  



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ padding: '20px' }}>
      <Chat />
      <CallModal/>
    </Container>
  );
}
