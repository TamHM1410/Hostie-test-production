import orderBy from 'lodash/orderBy';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  name: string;
  avatarUrl: string;
  totalFavorites: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function AppTopAuthors({ title, subheader, list, ...other }: Props|any) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ p: 3 }}>
        {
          list.map((item:any,index:number)=>{
            return             <AuthorItem key={index} url={item?.url_avatar ? item?.url_avatar :item?.ava} username={item?.username ? item?.username :item?.name} total_value={item?.total_value ?  item?.total_value: 'ADMIN'} type={other.type ? other.type:'normal'}/>


          })
        }
       
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type AuthorItemProps = {
  author: ItemProps;
  index: number;
};

function AuthorItem({ author, index ,url,username,total_value,type}: AuthorItemProps|any) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={username} src={url} />

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{username}</Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Iconify icon="solar:heart-bold" width={14} sx={{ mr: 0.5 }} />
          {/* {fShortenNumber(author.totalFavorites)} */} { total_value && type!=='admin'&&  <Box sx={{gap:2}}>Tổng tiền booking từ seller này: 
            <span style={{fontSize:15,fontWeight:700}}>  
              { new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total_value)}
             </span> </Box>}
            {
              type==="admin" &&<Box sx={{gap:2}}>
            <span style={{fontSize:15,fontWeight:700}}>{total_value} </span> </Box>
            }
        </Typography>
      </Box>

      <Iconify
        icon="solar:cup-star-bold"
        sx={{
          p: 1,
          width: 40,
          height: 40,
          borderRadius: '50%',
          color: 'primary.main',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          ...(index === 1 && {
            color: 'info.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
          ...(index === 2 && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
        }}
      />
    </Stack>
  );
}
