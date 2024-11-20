// @mui

///hook
import { useRouter } from 'next/navigation';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// assets
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  card: {
    subscription: string;
    price: number;
    caption: string;
    labelAction: string;
    lists: string[];
    name: string;
    description: string;
  };
  index: number;
};


export default function CurrentPackage({ card, sx, ...other }: Props | any) {
  const { price, caption, name, description } = card;

  const router = useRouter();

  const basic = 'basic';

  const renderIcon = (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
   

      {/* {starter && <Label color="info">POPULAR</Label>} */}
    </Stack>
  );

  const renderSubscription = (
    <Stack spacing={1} direction="row">
      <Typography variant="h4" sx={{ textTransform: 'capitalize' ,textAlign:'center'}}>
        Hiện tại bạn đang dùng
      </Typography>
    </Stack>
  );

  const renderPrice = (
    <Stack direction="row">
      <Typography variant="h2">{name}</Typography>
    </Stack>
  );

  const renderList = (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box component="span" sx={{ typography: 'overline' }}>
          Tính năng
        </Box>
      </Stack>

      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{
          typography: 'body2',
        }}
      >
        <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
        {description}
      </Stack>
    </Stack>
  );

  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        borderRadius: 2,
        boxShadow: (theme) => ({
          xs: theme.customShadows.card,
          md: 'none',
        }),

        ...sx,
      }}
      {...other}
    >
      {renderIcon}

      {renderSubscription}

      {renderPrice}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderList}
    </Stack>
  );
}
