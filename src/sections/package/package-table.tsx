import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';
import { useState } from 'react';

import { Chip} from '@mui/material';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { UserManagement } from 'src/types/users';
import {useCurrentPackage} from 'src/zustand/store';
import PackageMenu from './package-action-menu';

//  options
import { statusOption } from 'src/utils/options';

const columnHelper = createMRTColumnHelper<UserManagement | any>();

const PackageTable = (props: any) => {
  const { data = [] } = props;
  const [open, setOpen] = useState<boolean>(false);
  const { updatePackageZustand } = useCurrentPackage();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Tên',
      size: 220,
    }),
   

    columnHelper.accessor('description', {
      header: 'Mô tả',
      size: 220,
      Cell: ({ cell }) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
    }),

    columnHelper.accessor('status', {
      header: 'Trạng thái',
      size: 210,
      Cell: ({ cell }) => (
        <span>
          {cell.getValue() == 0 && <Chip label={statusOption[0]} variant="soft" color="error" />}
          {cell.getValue() == 1 && <Chip label={statusOption[1]} variant="soft" color="warning" />}
          {cell.getValue() == 2 && <Chip label={statusOption[2]} variant="soft" color="success" />}
        </span>
      ),
    }),
    columnHelper.accessor('price', {
      header: 'Giá',
      size: 190,
      Cell: ({ cell }) => (
        <span>
          {cell.getValue().toLocaleString('vi-VN')}

        </span>
      ),
    }),

    columnHelper.accessor('action', {
      header: 'Thao tác',
      size: 220,
      Cell: ({ cell }) => (
        <span
          onClick={(e) => {
          updatePackageZustand(cell.row.original);
          }}
        >
          <PackageMenu />
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
    enableRowSelection: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
   
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default PackageTable;
