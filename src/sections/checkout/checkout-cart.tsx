// HOOKS

import { useCurrentPackage } from 'src/zustand/store';
import { useRouter, useSearchParams } from 'next/navigation';

// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import EmptyContent from 'src/components/empty-content';
//

import { useQuery } from '@tanstack/react-query';
import { SplashScreen } from 'src/components/loading-screen';
import { findPackageById } from 'src/api/pagekages';

import CheckoutSummary from './checkout-summary';
import CheckoutCartProductList from './checkout-cart-product-list';
import { useCheckoutContext } from './context';


// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const checkout = useCheckoutContext();

  const empty = !checkout.items.length;

  const searchParam = useSearchParams();

  const router = useRouter();

  const { updatePackageZustand } = useCurrentPackage();

  const id = searchParam.get('packageId');

  const { data, isLoading } = useQuery({
    queryKey: ['package'],
    queryFn: () => {
      const rs = findPackageById(id);
      updatePackageZustand(rs);
      return rs;
    },
  });

  const handleNextStep = () => {
    router.push('/pricing/checkout/?step=1');
  };

  if (!id) {
    router.push('/pricing');
  }
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Giỏ hàng
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({1} gói )
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {!empty ? (
            <EmptyContent
              title="Cart is Empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl="/assets/icons/empty/ic_cart.svg"
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={[data]}
              onDelete={checkout.onDeleteCart}
              onIncreaseQuantity={checkout.onIncreaseQuantity}
              onDecreaseQuantity={checkout.onDecreaseQuantity}
            />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.product.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Chọn gói khác
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={data?.price}
          discount={checkout.discount}
          subTotal={data?.price}
          onApplyDiscount={checkout.onApplyDiscount}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={data ?false:true}
          onClick={handleNextStep}
        >
          Thanh toán
        </Button>
      </Grid>
    </Grid>
  );
}
