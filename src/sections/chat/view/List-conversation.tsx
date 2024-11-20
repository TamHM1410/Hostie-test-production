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

import AvatarGroup from '@mui/material/AvatarGroup';

import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';

export default function ListConversation({ item, index, id }: any) {
  const { data: session } = useSession();

  const router = useRouter();

  return (
    <>
      <ListItem button key={index} onClick={() => router.push(`/dashboard/chat?id=${item?.id}`)}>
        <ListItemIcon>
          <AvatarGroup max={3}>
            {item?.users &&
              Array.isArray(item?.users) &&
              item.users.length > 2 &&
              item?.users.map((user: any) => <Avatar alt="Remy Sharp" src={user.avatar} />)}
            {item?.users &&
              Array.isArray(item?.users) &&
              item?.users
                .filter((user: any) => user.id !== Number(session?.user?.id))
                .map((user: any) => <Avatar alt="Remy Sharp" src={user.avatar} />)}
          </AvatarGroup>
        </ListItemIcon>
        <ListItemText primary={item?.username} sx={{ color: 'black' }}>
          {item?.name}
        </ListItemText>
        <ListItemText
          secondary="online"
          // align="right"
          sx={{
            display: 'flex',
            alignItems: item?.id == id ? 'flex-start' : 'flex-end',
          }}
        />
      </ListItem>
    </>
  );
}
