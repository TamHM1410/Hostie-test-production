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
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useCurrentPaymentType } from 'src/zustand/package';
import { useSession } from 'next-auth/react';

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

export default function PricingCard({ card, sx, ...other }: Props | any) {
  const { price, caption, name, description } = card;

  const { updateType } = useCurrentPaymentType();

  const {data:session,status}=useSession()

  const router = useRouter();

  const basic = 'basic';
  const handleChoosePackage = () => {
    if(status==="unauthenticated"){
      router.push('/auth/jwt/login')
      return;

    }
    if (other?.type === 'upgrade') {
      updateType(other?.type);
    }

    router.push(`/pricing/checkout?step=0&type=${other.type}&packageId=${other?.packageId}`);
  };

  const renderIcon = (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box sx={{ width: 48, height: 48 }}>{basic && <PlanFreeIcon />}</Box>
    </Stack>
  );

  const renderSubscription = (
    <Stack spacing={1}>
      <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
        {name}
      </Typography>
      <Typography variant="subtitle2">{caption}</Typography>
    </Stack>
  );

  const renderPrice = (
    <Stack direction="row">
      <Typography variant="h4">$</Typography>

      <Typography variant="h2">{price.toLocaleString('vi-VN')}</Typography>

      <Typography
        component="span"
        sx={{
          alignSelf: 'center',
          color: 'text.disabled',
          ml: 1,
          typography: 'body2',
        }}
      >
        / đ
      </Typography>
    </Stack>
  );
  const renderPriceWithUpgrade = (
    <>
      <Stack direction="row">
        <Typography variant="h4">$</Typography>

        <Typography variant="h2" sx={{ textDecoration: 'line-through' }}>
          {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </Typography>

       
      </Stack>
      <Typography variant="h4" >
          Chỉ còn
        </Typography>
      <Stack direction="row">
        <Typography variant="h4">$</Typography>

        <Typography variant="h2" sx={{ color: 'red' }}>
        {(other?.upgradeCost ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </Typography>

       
      </Stack>
    </>
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
      spacing={2}
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

      {other?.upgradeCost ? renderPriceWithUpgrade : renderPrice}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderList}

      <Button
        fullWidth
        size="large"
        variant="contained"
        disabled={false}
        color={'primary'}
        onClick={handleChoosePackage}
      >
        {other?.upgradeCost ? 'Nâng cấp' : 'Chọn gói'}
      </Button>
    </Stack>
  );
}
