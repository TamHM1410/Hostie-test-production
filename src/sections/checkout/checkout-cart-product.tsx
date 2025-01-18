// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// utils
import { fCurrency } from 'src/utils/format-number';
// components

import Iconify from 'src/components/iconify';

// types
import { ICheckoutItem } from 'src/types/checkout';
import { useSearchParams } from 'next/navigation';
//


// ----------------------------------------------------------------------

type Props = {
  row: ICheckoutItem|any;
  onDelete: VoidFunction;
  onDecrease: VoidFunction;
  onIncrease: VoidFunction;
};

export default function CheckoutCartProduct({ row, onDelete, onDecrease, onIncrease }: Props) {
  const { name,  originalPrice,upgradeCost, coverUrl, description,duration } = row;
  const searchParams = useSearchParams();

  const type = searchParams.get('type') || 'normal';



  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
      

        <Stack spacing={0.5}>
          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
            {name ?name :'Unknow'}
          </Typography>
          <Typography sx={{fontStyle:'italic',fontSize:12}}>({description ?description :'Unknow'})</Typography>

        </Stack>
      </TableCell>

      <TableCell>{fCurrency((upgradeCost===0 ||!upgradeCost|| type!=='upgrade') ? originalPrice : upgradeCost)}</TableCell>

      <TableCell>{duration ?duration :'0'} ngày</TableCell>


   

    

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
