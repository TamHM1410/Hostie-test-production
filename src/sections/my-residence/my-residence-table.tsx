//    @hook
import { useState } from 'react';
import { UserManagement } from 'src/types/users';

/// @mui

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';

import { Box, Button, Chip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { mkConfig, generateCsv, download } from 'export-to-csv';

// import RoleActionMenu from './role-action-menu';

const columnHelper = createMRTColumnHelper<UserManagement | any>();

const statusOption = ['Rejected', 'Pending', 'Accepted'];

const BulterTable = (props: any) => {
  const { data = [] } = props;

  const [open, setOpen] = useState<boolean>(false);

  //   const { updateRoleZustand } = useCurrentRole();

  const columns = [
    columnHelper.accessor('name', {
      header: ' Name',
      size: 220,
    }),

    columnHelper.accessor('description', {
      header: 'Description',
      size: 220,
      Cell: ({ cell }: any) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
    }),

    columnHelper.accessor('status', {
      header: 'Status',
      size: 210,
      Cell: ({ cell }: any) => (
        <span>
          {cell.getValue() === 0 && <Chip label={statusOption[0]} variant="soft" color="error" />}
          {cell.getValue() === 1 && <Chip label={statusOption[1]} variant="soft" color="warning" />}
          {cell.getValue() === 2 && <Chip label={statusOption[2]} variant="soft" color="success" />}
        </span>
      ),
    }),

    columnHelper.accessor('action', {
      header: 'Action ',
      size: 220,
      Cell: ({ cell }: any) => (
        <span
          onClick={(e) => {
          }}
        >
        </span>
      ),
    }),
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows: MRT_Row<any>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          //  export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows?.length === 0}
          //  export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows?.length === 0}
          //  export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          //  only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default BulterTable;
