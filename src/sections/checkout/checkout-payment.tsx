import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePackage } from 'src/api/usePackage';
// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// types
import {
  ICheckoutCardOption,
  ICheckoutPaymentOption,
  ICheckoutDeliveryOption,
} from 'src/types/checkout';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
//

import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
// import CheckoutDelivery from './checkout-delivery';
// import CheckoutBillingInfo from './checkout-billing-info';
import CheckoutPaymentMethods from './checkout-payment-methods';
import { useCurrentPaymentType } from 'src/zustand/package';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS: ICheckoutDeliveryOption[] = [
  {
    value: 0,
    label: 'Free',
    description: '5-7 Days delivery',
  },
  {
    value: 10,
    label: 'Standard',
    description: '3-5 Days delivery',
  },
  {
    value: 20,
    label: 'Express',
    description: '2-3 Days delivery',
  },
];

const PAYMENT_OPTIONS: ICheckoutPaymentOption[] = [
  {
    value: 'vnpay',
    label: 'Thanh toán với VNPay',
    description:
      'Bạn sẽ được chuyển hướng đến trang web VNPAY để hoàn tất giao dịch mua hàng một cách an toàn.',
  },
  {
    value: 'credit',
    label: 'Credit / Debit Card',
    description: 'Chúng tôi hỗ trợ Mastercard, Visa, Discover và Stripe',
  },
  {
    value: 'cash',
    label: 'Tiền mặt',
    description: 'Chỉ thanh toán bằng tiền mặt khi đến trực tiếp văn phòng của chúng tôi ',
  },
];

const CARDS_OPTIONS: ICheckoutCardOption[] = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment({ price, id, discount, step }: any) {
  const { registerPackageApi, upgrade_package, extendPackageApi } = usePackage();

  const { type, package_id } = useCurrentPaymentType();

  // const id = searchParams.get('packageId') || package_id;

  const checkout = useCheckoutContext();

  const router = useRouter();

  const searchParam = useSearchParams();

  const currentId = searchParam.get('packageId');

  const typePackage = searchParam.get('type');

  const { data: session } = useSession();

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required'),
  });

  const defaultValues = {
    delivery: checkout.shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        userId: session?.user?.id,
        packageId: currentId,
      };

      if (typePackage === 'extend') {
        const result: any = await extendPackageApi(Number(currentId));
        router.push(result?.paymentUrl);
      }

      if (typePackage === 'upgrade') {
        const result: any = await upgrade_package(Number(currentId));
        router.push(result?.paymentUrl);
      }
      if (typePackage === 'normal') {
        const result: any = await registerPackageApi(Number(currentId));
        router.push(result?.paymentUrl);
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
      console.error(error, 'err');
    }
  });

  const handleBack = () => {
    router.push(
      `/pricing/checkout/?step=0&type=${type ? type : typePackage}&packageId=${currentId}`
    );
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            options={PAYMENT_OPTIONS}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={handleBack}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Trở về
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={price - price * (checkout.discount / 100)}
            subTotal={price}
            discount={discount}
            shipping={checkout.shipping}
            onEdit={() => checkout.onGotoStep(0)}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Thanh toán
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
