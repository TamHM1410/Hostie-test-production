'use client';

// @mui

import Container from '@mui/material/Container';
// routes
// hooks

import { useSettingsContext } from 'src/components/settings';
// types
//
;
import Chat from './render-message';
import CallModal from './CallModal';
// ----------------------------------------------------------------------

export default function ChatView() {



  const settings = useSettingsContext();



  



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ padding: '20px' }}>
      <Chat />
      <CallModal/>
    </Container>
  );
}
