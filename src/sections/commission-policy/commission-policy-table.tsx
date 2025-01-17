//@hook
import { useState } from 'react';
import { UserManagement } from 'src/types/users';
import { useCurrentRole } from 'src/zustand/store'



///@mui

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';

import { Box, Button, Chip,MenuItem} from '@mui/material';



///@another
import { mkConfig, generateCsv, download } from 'export-to-csv';

// import RoleActionMenu from './role-action-menu';
const columnHelper = createMRTColumnHelper<UserManagement | any>();

const statusOption = ['Từ chối','Đang xử lý', 'Chấp thuận' ];

const CommissionPolicyTable = (props: any) => {
  const { data = [] } = props;
  const [open, setOpen] = useState<boolean>(false);
  const { updateRoleZustand } = useCurrentRole();

  const columns = [
    columnHelper.accessor('validFrom', {
      header: 'Có hiệu lực từ',
      size: 220,
    }),

    columnHelper.accessor('minPoint', {
      header: 'Điểm tối thiểu',
      size: 220,
      Cell: ({ cell }:any) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
    }),

    columnHelper.accessor('commissionRate', {
      header: 'Tỷ lệ hoa hồng',
      size: 210,
      Cell: ({ cell }:any) => (
        <span> 
             {cell.getValue() ===0 && <Chip label={statusOption[0]}variant='soft' color="error" />}
            {cell.getValue() === 1 && <Chip label={statusOption[1]} variant='soft'color="warning" />}
            {cell.getValue() === 2 && <Chip label={statusOption[2]} variant='soft' color="success" />}
        
        </span>
      ),
    }),

    columnHelper.accessor('maxCommission', {
      header: 'Tỷ lệ hoa hồng tối đa',
      size: 220,
    }),
    columnHelper.accessor('policyDescription', {
        header: 'Thao tác',
        size: 220,
        Cell: ({ cell }:any) => (
          <span
            onClick={() => {
            updateRoleZustand(cell.row.original);
            }}
          >
            {/* <RoleActionMenu /> */}
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
   
      <MaterialReactTable table={table}  />
    
  );
};

export default CommissionPolicyTable;
