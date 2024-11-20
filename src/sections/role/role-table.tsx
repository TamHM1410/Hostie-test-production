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

import { Box, Button, Chip} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';


///@another
import { mkConfig, generateCsv, download } from 'export-to-csv';

import RoleActionMenu from './role-action-menu';
const columnHelper = createMRTColumnHelper<UserManagement | any>();

const statusOption = ['Rejected','Pending', 'Accepted' ];

const RoleTable = (props: any) => {
  const { data = [] } = props;
  const [open, setOpen] = useState<boolean>(false);
  const { updateRoleZustand } = useCurrentRole();

  const columns = [
    columnHelper.accessor('name', {
      header: ' Tên',
      size: 220,
    }),

    columnHelper.accessor('description', {
      header: 'Mô tả',
      size: 220,
      Cell: ({ cell }:any) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
    }),

    columnHelper.accessor('status', {
      header: 'Trạng thái',
      size: 210,
      Cell: ({ cell }:any) => (
        <span> 
             {cell.getValue() ===0 && <Chip label={statusOption[0]}variant='soft' color="error" />}
            {cell.getValue() === 1 && <Chip label={statusOption[1]} variant='soft'color="warning" />}
            {cell.getValue() === 2 && <Chip label={statusOption[2]} variant='soft' color="success" />}
        
        </span>
      ),
    }),

    columnHelper.accessor('action', {
      header: 'Hành động',
      size: 220,
      Cell: ({ cell }:any) => (
        <span
          onClick={() => {
          updateRoleZustand(cell.row.original);
          }}
        >
          <RoleActionMenu />
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

export default RoleTable;
