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

const statusOption = ['Hết hạn', 'Đang xử lý,', 'Thành công', 'Thất bại '];

const PurchaseHistory = (props: any) => {
  const { data = [] } = props;

  console.log('data', data);
  const columns = [
    columnHelper.accessor('packageName', {
      header: ' Tên gói',
      size: 220,
    }),

    columnHelper.accessor('createdAt', {
      header: 'Ngày mua',
      size: 220,
      Cell: ({ cell }: any) => (
        <span>{cell.getValue() == null ? 'none' : cell.getValue().slice(0, 10)}</span>
      ),
    }),
    columnHelper.accessor('expireAt', {
      header: 'Ngày hết hạn',
      size: 220,
      Cell: ({ cell }: any) => (
        <span>{cell.getValue() == null ? 'none' : cell.getValue().slice(0, 10)}</span>
      ),
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
    columnHelper.accessor('registerType', {
      header: 'Loại giao dịch',
      size: 220,
      Cell: ({ cell }: any) => (
        <span>
          {cell.getValue() === 'NEW' && <Chip label="Đăng ký mới" variant="soft" color="primary" />}
          {cell.getValue() === 'RENEW' && (
            <Chip label="Gia hạn" variant="soft" color="primary" />
          )}

          {cell.getValue() === 'UPGRADE' && (
            <Chip label="Nâng cấp gói" variant="soft" color="primary" />
          )}
        </span>
      ),
    }),

    columnHelper.accessor('status', {
      header: 'Trạng thái giao dịch',
      size: 210,
      Cell: ({ cell }: any) => (
        <span>
          {cell.getValue() === 3 && <Chip label={statusOption[3]} variant="soft" color="error" />}
          {cell.getValue() === 2 && <Chip label={statusOption[2]} variant="soft" color="success" />}
          {cell.getValue() === 1 && <Chip label={statusOption[1]} variant="soft" color="warning" />}
          {cell.getValue() === 0 && <Chip label={statusOption[0]} variant="soft" color="default" />}
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

export default PurchaseHistory;
