//  @hook

/// @mui

import {
    MaterialReactTable,
    useMaterialReactTable,
    createMRTColumnHelper,
  } from 'material-react-table';
  
  import { Chip } from '@mui/material';
  
  /// @another
  
  // import RoleActionMenu from './role-action-menu';
  const columnHelper = createMRTColumnHelper<any>();
  
  const statusOption = ['Thất bại', 'Đang xử lí', 'Thành công'];
  
  const TransactionTable = (props: any) => {
    const { data = [] } = props;
  
    const columns = [
        columnHelper.accessor('registerId', {
            header: ' Mã giao dịch',
            size: 50,
          }),

          columnHelper.accessor('username', {
            header: ' Người mua',
            size: 50,
          }),
      columnHelper.accessor('packageName', {
        header: ' Tên gói',
        size: 220,
      }),
  
      columnHelper.accessor('createdAt', {
        header: 'Ngày mua',
        size: 220,
        Cell: ({ cell }: any) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
      }),
    
      columnHelper.accessor('packagePrice', {
        header: 'Giá tiền',
        size: 220,
        Cell: ({ cell }: any) => (
          <span>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(cell.getValue())}
          </span>
        ),
      }),
  
      columnHelper.accessor('status', {
        header: 'Trạng thái giao dịch',
        size: 220,
        Cell: ({ cell }: any) => (
          <span>
            {cell.getValue() === 0 && <Chip label={statusOption[0]} variant="soft" color="error" />}
            {cell.getValue() === 1 && <Chip label={statusOption[1]} variant="soft" color="warning" />}
            {cell.getValue() > 1 && <Chip label={statusOption[2]} variant="soft" color="success" />}
          </span>
        ),
      }),
    ];
  
    const table = useMaterialReactTable({
      columns,
      data,
      enableRowSelection: false,
      columnFilterDisplayMode: 'popover',
      paginationDisplayMode: 'pages',
      positionToolbarAlertBanner: 'bottom',
    });
  
    return <MaterialReactTable table={table} />;
  };
  
  export default TransactionTable;
  