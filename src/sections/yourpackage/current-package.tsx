// @mui

///hook
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// assets
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';
// components
import { useCurrentPaymentType } from 'src/zustand/package';

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
  const { updateType, updateId } = useCurrentPaymentType();

  const { price, caption, name, description, duration, id } = card;

  console.log(other.expireAt, 'ex', other.startAt, 'day', other.daysLeft);
  const router = useRouter();

  const handleOnclick = () => {
    updateType('extend');
    updateId(id);
    router.push(`/pricing/checkout?step=0&type=extend&packageId=${id}`);
  };
  const renderIcon = (
    <Stack direction="row" alignItems="center" justifyContent="space-between"></Stack>
  );

  const renderSubscription = (
    <Stack spacing={1} direction="row">
      <Typography variant="h4" sx={{ textTransform: 'capitalize', textAlign: 'center' }}>
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
          Gói của bạn còn{' '}
          <span style={{ fontSize: 30, margin: 2 }}>
            {' '}
            {other?.daysLeft ? other?.daysLeft : duration}
          </span>{' '}
          ngày
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box component="span" sx={{ typography: 'overline' }}>
          Ngày mua{' '}
          <span style={{ fontSize: 30, margin: 2 }}>
            {' '}
            {other?.startAt ? other?.startAt : duration}
          </span>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box component="span" sx={{ typography: 'overline' }}>
          Ngày hết hạn{' '}
          <span style={{ fontSize: 30, margin: 2 }}>
            {' '}
            {other?.expireAt ? other?.expireAt : duration}
          </span>
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
        <Button sx={{ width: '100%', color: 'primary' }} variant="outlined" onClick={handleOnclick}>
          {' '}
          Gia hạn ngay
        </Button>
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
