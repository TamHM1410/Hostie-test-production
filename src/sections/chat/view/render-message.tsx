import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IconButton } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import InfiniteScroll from 'react-infinite-scroll-component';
import FormProvider from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { makeStyles } from '@mui/styles';
import { socket } from 'src/utils/socketIo';
import { getListConversation, getListGroupMessage } from 'src/api/conversations';
import { useQueries } from '@tanstack/react-query';
import { useConversation } from 'src/zustand/chats';
import {
  List,
  Box,
  Divider,
  TextField,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Paper,
  Grid,
} from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import ListConversation from './List-conversation';
import ChatSection from './Chat-section';
import Tiptap from 'src/components/tiptap/tiptap';
import CallModal from './CallModal';

const notificationSound = typeof window !== 'undefined' ? new Audio('/assets/messnoti.mp3') : null;

const useStyles = makeStyles({
  chatSection: {
    width: '100%',
    height: 'calc(100vh - 100px)', // Adjust total height
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0',
  },
  messageArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  messagesWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  inputArea: {
    padding: '20px',
    borderTop: '1px solid #e0e0e0',
  },
});

const Chat = () => {
  const classes = useStyles();
  const searchParam = useSearchParams();
  const { data: session } = useSession() as any;
  const id = searchParam.get('id');

  const group_id = searchParam.get('group_id');

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const nearestMessageEndRef = useRef<any>(null);

  const listNewMessageRef = useRef<any[]>([]);

  const messageRef = useRef<any[]>([]);
  const page = useRef<number>(1);

  const { updateConversation, updateMsg, listMsg, listConver } = useConversation();
  const [listConversation, setListConversation] = useState<any[]>([]);
  const [detailMessage, setDetailMessage] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isUploadImage, setIsUploadImage] = useState(false);

  useQueries({
    queries: [
      {
        queryKey: ['listConversation'],
        queryFn: async () => {
          const res = await getListConversation();
          if (res) {
            setListConversation(res.data?.result || []);
          }

          return res;
        },
      },
      {
        queryKey: ['listMessage', group_id],
        queryFn: async () => {
          if (group_id) {
            const res = await getListGroupMessage(group_id, page.current);
            const sortedMessages = Array.isArray(res.data?.result)
              ? res.data.result.sort((a: any, b: any) => a.id - b.id)
              : [];

            setDetailMessage(sortedMessages);
            // updateMsg(sortedMessages,group_id);
            messageRef.current = sortedMessages;
            if (sortedMessages.length === 0) setHasMore(false);
            return res;
          }
        },
        enabled: !!group_id,
      },
    ],
  });

  const LoginSchema = Yup.object().shape({
    message: Yup.string().required('Message is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: { message: '' },
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      socket.emit('send_msg', {
        sender_id: session?.user?.id,
        receiver_id: id,
        message: data.message,
        message_type: 'text',
      });
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  const handleLoadMoreMessage = async () => {
    try {
      setIsLoadingMore(true); // Bắt đầu load more
      const nextPage = page.current + 1;
      const res = await getListGroupMessage(id, nextPage);

      const newMessages = Array.isArray(res.data?.result)
        ? res.data.result.sort((a: any, b: any) => a.id - b.id)
        : [];

      nearestMessageEndRef.current = document.getElementById(`message-${newMessages[9]?.id}`);

      if (newMessages.length === 0) {
        setHasMore(false);
        return;
      }

      setDetailMessage((prev) => [...newMessages, ...prev]);
      messageRef.current = [...newMessages, ...messageRef.current];
      page.current = nextPage;
    } catch (error) {
      console.error('Error loading more messages:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false); //
    }
  };

  useEffect(() => {
    if (id||group_id) {
      socket.emit('subscribe', { room_id: session?.user?.id });

      socket.on('common.chat.receive_message', (msg) => {

        if (msg?.sender_id !== Number(session.user.id)) {
          messageRef.current.push(msg);
          setDetailMessage([...messageRef.current]);
          updateMsg(...messageRef.current, id);
          notificationSound?.play();
        }

        for (let i = 0; i < listNewMessageRef.current.length; i++) {
          if (listNewMessageRef.current[i] && listNewMessageRef.current[i]?.uuid === msg?.uuid) {
            listNewMessageRef.current[i].created_at = 'Đã gửi';
          }
        }

        setDetailMessage([...messageRef.current]);
        updateMsg(...messageRef.current, id);
      });

      return () => {
        socket.off('common.chat.receive_message');
      };
    }
  }, [id, session?.user?.id,group_id]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {


    if (!isLoadingMore && nearestMessageEndRef.current) {
      nearestMessageEndRef.current.scrollIntoView({ behavior: 'smooth' });
      nearestMessageEndRef.current = null; 
    }
    if (!isLoadingMore) {
      scrollToBottom();
    }
  }, [isLoadingMore]);

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>

      <Grid container component={Paper} className={classes.chatSection}>
        {/* Left Sidebar */}
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src={session?.user?.urlAvatar} />
              </ListItemIcon>
              <ListItemText primary={session?.user?.name} />
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: '10px' }}>
            <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
          </Grid>
          <Divider />
          <Scrollbar>
            <List>
              {listConversation.map((item, index) => (
                <ListConversation key={index} item={item} index={index} id={id} />
              ))}
            </List>
          </Scrollbar>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={9} className={classes.chatContainer}>
          <Box sx={{ display: 'flex', justifyContent: 'end', px: 3, py: 1 }}>
            <IconButton>
              <LocalPhoneIcon />
            </IconButton>
            <IconButton>
              <VideocamIcon />
            </IconButton>
          </Box>
          <Divider />

          {/* Messages */}

          {(group_id || id) && detailMessage && Array.isArray(detailMessage) ? (
            <Box className={classes.messagesWrapper}>
              <div
                id="scrollableDiv"
                style={{
                  height: '100%',
                  overflow: 'auto',
                  flexDirection: 'column-reverse',
                  display: 'flex',
                }}
              >
                <InfiniteScroll
                  dataLength={detailMessage.length}
                  next={handleLoadMoreMessage}
                  hasMore={hasMore}
                  loader={
                    <Typography sx={{ textAlign: 'center', py: 2 }}>
                      {messageRef.current.length > 8 && '⏳ Đang tải lên...'}
                    </Typography>
                  }
                  style={{ display: 'flex', flexDirection: 'column-reverse' }}
                  inverse
                  scrollableTarget="scrollableDiv"
                >
                  <List>
                    {detailMessage.map((item, index) => (
                      <ChatSection key={index} item={item} index={index} />
                    ))}
                    <div ref={messageEndRef} />
                  </List>
                </InfiniteScroll>
              </div>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Typography variant="body1">Nhấn vào cuộc trò chuyện để bắt đầu</Typography>
            </Box>
          )}

          {/* Input Area */}
          {(group_id || id) && (
            <Box className={classes.inputArea}>
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <Tiptap
                  checkNewGroup={
                    listConversation && listConversation.length > 0 ? listConversation[0] : []
                  }
                  group_id={group_id}
                  id={id}
                  setDetailMessage={setDetailMessage}
                  messageRef={messageRef}
                  listNewMessageRef={listNewMessageRef}
                  scrollToBottom={scrollToBottom}
                  setIsUploadImage={setIsUploadImage}
                />
              </FormProvider>
            </Box>
          )}
        </Grid>
      </Grid>
      <CallModal />
    </div>
  );
};

export default Chat;
