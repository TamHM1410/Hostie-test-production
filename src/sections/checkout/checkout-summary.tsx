// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import { useQuery } from '@tanstack/react-query';
import { getUserDiscount } from 'src/api/pagekages';

// ----------------------------------------------------------------------

type Props = {
  total: number;
  discount?: number;
  subTotal: number;
  shipping?: number;
  //
  onEdit?: VoidFunction;
  onApplyDiscount?: (discount: number) => void;
};

export default function CheckoutSummary({
  total,
  discount,
  subTotal,
  shipping,
  //
  onEdit,
  onApplyDiscount,
}: Props) {

 
 console.log('discountdd',typeof discount)
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Chi tiết đơn của bạn"
        action={
          onEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="solar:pen-bold" />}>
              Sửa
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Tổng tiền
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subTotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Giảm giá
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(subTotal*discount) : `0`}</Typography>
          </Stack>

        

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Tổng </Typography>
            <Box sx={{ textAlign: 'right' }}>
       
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
              {/* ${subTotal - (subTotal * (discount )) } */}
              {new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
}).format(subTotal - (subTotal * (discount )) )}
              </Typography>

               
               
              {/* <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (Đã bao gồm VAT)
              </Typography> */}
            </Box>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
}
