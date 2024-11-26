'use client';

// --hook
import { useQuery, useQueries } from '@tanstack/react-query';
import { useCurrentPackage } from 'src/zustand/store';
import { findPackageById, getUserDiscount } from 'src/api/pagekages';

// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// _mock
import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';
// components
import { useSettingsContext } from 'src/components/settings';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoadingScreen } from 'src/components/loading-screen';

//
import { useCheckoutContext } from '../context';
import CheckoutCart from '../checkout-cart';
import CheckoutSteps from '../checkout-steps';
import CheckoutPayment from '../checkout-payment';
import CheckoutOrderComplete from '../checkout-order-complete';

import { useCurrentPaymentType } from 'src/zustand/package';
// ----------------------------------------------------------------------

export default function CheckoutView() {
  // const router=useRouter()

  const { currentPackage } = useCurrentPackage();

  const { updateType ,updateId} = useCurrentPaymentType();


  const settings = useSettingsContext();

  const router=useRouter()

  const checkout = useCheckoutContext();

  const searchParams = useSearchParams();

  const params = Object.fromEntries(searchParams.entries())


  const step = searchParams.get('step') || 0;

  const id = searchParams.get('packageId') || currentPackage?.id;

  const type = searchParams.get('type') || 'normal';


  const { data } = useQuery({
    queryKey: ['package'],
    queryFn: async () => {
      updateId(id)
      updateType(type)
      const res= await findPackageById(id, type)
      return res
    },
  });
 console.log(params,'params')
  const results = useQueries({
    queries: [
      {
        queryKey: ['post'],
        queryFn: async () => {
          const rs = await getUserDiscount();
          if (typeof rs !== 'number') {
            return rs?.data?.result;
          }
          return rs;
        },
      },
    ],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });
  if(Object.keys(params).length <1 ||  id==="0"){
    router.push('/dashboard/yourpackage')

  }
  if (results.pending) {
    return <LoadingScreen />;
  }


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Thanh toán
      </Typography>

      <Grid container justifyContent={checkout.completed ? 'center' : 'flex-start'}>
        <Grid xs={12} md={8}>
          <CheckoutSteps activeStep={+step} steps={PRODUCT_CHECKOUT_STEPS} />
        </Grid>
      </Grid>

      {checkout.completed ? (
        <CheckoutOrderComplete
          open={checkout.completed}
          onReset={checkout.onReset}
          onDownloadPDF={() => {}}
        />
      ) : (
        <>
          {step && step === '0' && <CheckoutCart  data={data} discount={results.data[0]} step={step} />}

          {step && step === '1' && (
            <CheckoutPayment
              price={(data?.upgradeCost===0 || !data?.upgradeCost)   ?data?.originalPrice :  data?.upgradeCost}
              id={data?.id}
              discount={results.data[0]}
              step={step}
            />
          )}
        </>
      )}
    </Container>
  );
}
