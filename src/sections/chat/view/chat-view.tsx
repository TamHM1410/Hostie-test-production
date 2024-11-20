'use client';

import { useEffect, useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// routes
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// api
import { useGetContacts } from 'src/api/chat';
// components
import { useSettingsContext } from 'src/components/settings';
// types
import { IChatParticipant } from 'src/types/chat';
//
;
import { socket } from 'src/utils/socketIo';
import Chat from './render-message';
// ----------------------------------------------------------------------

export default function ChatView() {
  const router = useRouter();

  const { user } = useMockedUser();

  const settings = useSettingsContext();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const [recipients, setRecipients] = useState<IChatParticipant[]>([]);

  const { contacts } = useGetContacts();

  

  useEffect(() => {
    socket.emit('user_connected', {
      userId: '6715b94c7776873e3bf9326d',
    });
    socket.on('client_receive', (msg) => {
      console.log(msg, 'hihi');
    });
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ padding: '20px' }}>
      <Chat />
    </Container>
  );
}
