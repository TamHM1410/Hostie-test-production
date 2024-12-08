// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// types
import { ICheckoutItem } from 'src/types/checkout';
// components
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
//
import CheckoutCartProduct from './checkout-cart-product';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Gói' },
  { id: 'price', label: 'Giá' },

  { id: 'duration',label:'Thời gian' },
  { id: '' },

];

// ----------------------------------------------------------------------

type Props = {
  products: ICheckoutItem[];
  onDelete: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
};




export default function CheckoutCartProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  console.log(products,'product')
 
  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            
            {products &&products.length>0  && products.map((row,index) => (
              <CheckoutCartProduct
                key={index}
                row={row}
                onDelete={() => onDelete(row.id)}
                onDecrease={() => onDecreaseQuantity(row.id)}
                onIncrease={() => onIncreaseQuantity(row.id)}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
