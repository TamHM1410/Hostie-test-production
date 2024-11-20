'use client';

// --hook
import { useQuery,useQueries } from '@tanstack/react-query';
import { useCurrentPackage } from 'src/zustand/store';
import { findPackageById ,getUserDiscount} from 'src/api/pagekages';

// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// _mock
import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';
// components
import { useSettingsContext } from 'src/components/settings';
import { useSearchParams ,useRouter} from 'next/navigation';
//
import { useCheckoutContext } from '../context';
import CheckoutCart from '../checkout-cart';
import CheckoutSteps from '../checkout-steps';
import CheckoutPayment from '../checkout-payment';
import CheckoutOrderComplete from '../checkout-order-complete';

// ----------------------------------------------------------------------

export default function CheckoutView() {
    
  // const router=useRouter()
  
  const {currentPackage}=useCurrentPackage()

  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  const searchParams = useSearchParams()
 
  const step = searchParams.get('step') ||0
  
  const id =searchParams.get('packageId') || currentPackage?.id

  const onSuccess =searchParams.get('onSuccess')

  const {data}=useQuery({
    queryKey:['package'],
    queryFn:()=>findPackageById(id)
  })

  const results = useQueries({
    queries: [
      { queryKey: ['post'], queryFn:async ()=> {
        const rs =await getUserDiscount()
        return rs
      } },
     
    ],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      }
    },
  }) 
 if(results.pending){
  return <>...loading</>
 }

 console.log(results.data[0])
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Thanh toán
      </Typography>

      <Grid container justifyContent={checkout.completed ? 'center' : 'flex-start'}>
        <Grid xs={12} md={8}>
          <CheckoutSteps activeStep={+step } steps={PRODUCT_CHECKOUT_STEPS} />
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
          {step&& step === '0' && <CheckoutCart discount={results.data[0]}/>}

          {step&& step === '1' && <CheckoutPayment price={data?.price} id={data?.id}  discount={results.data[0]}/>}


        
        </>
      )}
    </Container>
  );
}
