'use client'
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
  Fab,
  Paper,
  Grid,
} from '@mui/material';

import { useSession } from 'next-auth/react';

import FileMessage from './FileMessage';

export default function ChatSection({item,index}:any) {
  
  const {data:session}=useSession()

  return <>
   <ListItem key={index}>
                        <Grid container>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent:
                                  item?.sender_id !== Number(session?.user.id) ? 'start' : 'end',
                                gap: 2,
                                py: 1,
                              }}
                            >
                              {item?.sender_id !== Number(session?.user.id) && (
                                <Box>
                                  <Avatar
                                    src={item.sender_avatar}
                                    alt="https://camo.githubusercontent.com/71f459f4a7558094d8b1cdc511cfcbf7c273b7217d7c9e1675cbbc93cd04ede0/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323639323831302f323130343036312f34643839316563302d386637362d313165332d393230322d6637333934306431306632302e706e67"
                                  />
                                </Box>
                              )}

                              {/* //// message*/}
                              <Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent:
                                      item?.sender_id !== Number(session?.user.id) ? 'start' : 'end',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', gap: 0.5, cursor: 'pointer' }}>
                                    {item?.files &&
                                      Array.isArray(item?.files) &&
                                      item?.files.length > 0 && <FileMessage files={item?.files} />}
                                  </Box>

                                  {item?.message && (
                                    <>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          justifyContent:
                                            item?.sender_id !== Number(session?.user.id)
                                              ? 'start'
                                              : 'end',
                                        }}
                                      >
                                        <Box
                                        id={`message-${item.id}`}
                                          sx={{
                                            padding: 1,
                                            paddingX: 1.5,
                                            borderRadius: 0.8,
                                            backgroundColor: 'rgb(0 145 249)',
                                            fontFamily: 'sans-serif',
                                            fontSize: 16,
                                            color: 'white',
                                            fontWeight: 200,
                                            textAlign: 'center',
                                            width: 'auto',
                                            maxWidth: 'fit-content',
                                            display: 'flex',

                                            wordWrap: 'break-word', // Nếu tin nhắn dài, sẽ xuống dòng
                                          }}
                                        >
                                          {item?.message}
                                        </Box>
                                      </Box>
                                    </>
                                  )}
                                </Box>
                                <ListItemText
                                  sx={{
                                    display: 'flex',
                                    // alignItems: item?.sender_id !== Number(session.user.id) ? 'flex-start' : 'flex-end',
                                    justifyContent:
                                      item?.sender_id !== Number(session?.user.id) ? 'start' : 'end',
                                  }}
                                  // align={item?.id == id ? 'right' : 'left'}
                                  secondary={
                                    item?.created_at &&
                                    typeof item?.created_at == 'string' &&
                                    !isNaN(item?.created_at.charAt(0))
                                      ? item?.created_at?.slice(11).substring(0, 5)
                                      : item?.created_at
                                  }
                                />
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </ListItem>
  
  </>;
}
