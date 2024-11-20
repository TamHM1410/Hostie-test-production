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
//


// ----------------------------------------------------------------------

type Props = {
  row: ICheckoutItem|any;
  onDelete: VoidFunction;
  onDecrease: VoidFunction;
  onIncrease: VoidFunction;
};

export default function CheckoutCartProduct({ row, onDelete, onDecrease, onIncrease }: Props) {
  const { name,  price, coverUrl, description,duration } = row;

  console.log(row,'row')

  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
      

        <Stack spacing={0.5}>
          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
            {name}
          </Typography>
          <Typography sx={{fontStyle:'italic',fontSize:12}}>({description})</Typography>

        </Stack>
      </TableCell>

      <TableCell>{fCurrency(price)}</TableCell>

      {/* <TableCell>{fCurrency(description)}</TableCell> */}
      <TableCell>{duration} month</TableCell>


   

    

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
