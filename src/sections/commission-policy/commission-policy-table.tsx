//@hook
import { useState } from 'react';
import { UserManagement } from 'src/types/users';
import { useCurrentRole } from 'src/zustand/store';

///@mui

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';

import { Tooltip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
///@another
import { mkConfig, generateCsv, download } from 'export-to-csv';
import EditCommission from './edit-commission-policy';

// import RoleActionMenu from './role-action-menu';
const columnHelper = createMRTColumnHelper<UserManagement | any>();

const CommissionPolicyTable = (props: any) => {
  const { data = [] } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const columns = [
    columnHelper.accessor('validFrom', {
      header: 'Có hiệu lực từ',
      size: 220,
    }),

    columnHelper.accessor('minPoint', {
      header: 'Điểm tối thiểu',
      size: 220,
      Cell: ({ cell }: any) => (
        <span>{cell.getValue() == null ? 'none' : cell.getValue().toLocaleString('vi-VN')}</span>
      ),
    }),

    columnHelper.accessor('commissionRate', {
      header: 'Tỷ lệ hoa hồng (%)',
      size: 210,
    }),

    columnHelper.accessor('maxCommission', {
      header: 'Tỷ lệ hoa hồng tối đa (%)',
      size: 220,
    }),
    columnHelper.accessor('policyDescription', {
      header: 'Mô tả',
      size: 220,
    
    }),
    columnHelper.accessor('actionsd', {
      header: 'Thao tác',
      size: 220,
      Cell: ({ cell }: any) => (
        <span
          onClick={() => {
            setSelectedItem(cell.row.original);
            setOpen(!open);
          }}
        >
          <Tooltip title="Chỉnh sửa">
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </span>
      ),
    }),
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
  });

  return (
    <>
      <MaterialReactTable table={table} />{' '}
      <EditCommission selectedItem={selectedItem} open={open} setOpen={setOpen} />
    </>
  );
};

export default CommissionPolicyTable;
