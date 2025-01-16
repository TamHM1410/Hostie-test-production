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
  styled,
} from '@mui/material';

import AvatarGroup from '@mui/material/AvatarGroup';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Styled ListItem component with hover effects
const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  borderRadius: '8px',
  margin: '4px 8px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(4px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
    },
    '& .MuiAvatar-root': {
      transform: 'scale(1.05)',
    },
  },
  '& .MuiAvatar-root': {
    transition: 'transform 0.2s ease-in-out',
  },
  '&:active': {
    transform: 'translateX(2px) scale(0.99)',
  },
}));

// Styled AvatarGroup for hover animation
const StyledAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  '& .MuiAvatar-root': {
    border: `2px solid ${theme.palette.background.paper}`,
    transition: 'all 0.2s ease-in-out',
  },
}));

export default function ListConversation({ item, index, id }: any) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <StyledListItem
        button
        key={index}
        onClick={() => router.push(`/dashboard/chat?group_id=${item?.id}`)}
      >
        <ListItemIcon>
          <StyledAvatarGroup max={3}>
            {item?.users &&
              Array.isArray(item?.users) &&
              item.users.length > 2 &&
              item?.users.map((user: any) => (
                <Avatar 
                  key={user.id} 
                  alt={user.name || 'User Avatar'} 
                  src={user.avatar}
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                />
              ))}
            {item?.users &&
              Array.isArray(item?.users) &&
              item?.users
                .filter((user: any) => user.id !== Number(session?.user?.id))
                .map((user: any) => (
                  <Avatar 
                    key={user.id} 
                    alt={user.name || 'User Avatar'} 
                    src={user.avatar}
                    sx={{
                      width: 40,
                      height: 40,
                    }}
                  />
                ))}
          </StyledAvatarGroup>
        </ListItemIcon>
        <ListItemText 
          primary={
            <Typography
              component="span"
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary',
                transition: 'color 0.2s ease-in-out',
              }}
            >
              {item?.name}
            </Typography>
          }
        />
      </StyledListItem>
      <Divider variant="inset" component="li" sx={{ ml: 0, mr: 0 }} />
    </>
  );
}