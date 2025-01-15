import { useEffect, useState} from 'react';
import Switch from '@mui/material/Switch';

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';
import Image from 'next/image';

import { Box, Button, Chip, Menu, MenuItem } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { UserManagement } from 'src/types/users';
import { useCurrentUser } from 'src/zustand/store';

// import UserDetailModal from './view-user-detail-modal';
import useUpdateActiveModal from '../hooks/useUpdateActiveModal';


const columnHelper = createMRTColumnHelper<UserManagement | any>();
const statusOption = ['Tạm ngưng', 'Đang chờ khách', 'Đang hoạt động'];

const ButlerTable = (props: any) => {
  const { data = [] } = props;

  const { currenUserSelected, updateUserSelected } = useCurrentUser();

  const [openActiveModal, setOpenActive] = useState(false);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const activeModal = useUpdateActiveModal({
    open: openActiveModal,
    setOpen: setOpenActive,
    type: 'user',
  });

  const columns = [
    columnHelper.accessor('residence_name', {
      header: ' Căn hộ ',

      size: 250,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;
        return (
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Image src={row.images[0]?.image} alt="cc" width={100} height={100} loading="lazy" />
            </Box>
            <Box>
              <Box sx={{ fontSize: 18, pt: 3 }}>{cell.getValue()}</Box>
              <Box sx={{ fontSize: 12, fontStyle: 'italic' }}>
                địa chỉ: {row?.residence_address} ,{row?.ward}
              </Box>
            </Box>
          </Box>
        );
      },
    }),

    columnHelper.accessor('residence_type', {
      header: 'Loại căn hộ',
      size: 80,
    }),
    columnHelper.accessor('province', {
      header: 'Khu vực',
      size: 180,
    }),
    columnHelper.accessor('status', {
      header: 'Trạng thái hoạt động',
      size: 180,
      Cell: ({ cell }: any) => (
        <span>
          {cell?.getValue() === 0 && <Chip label={statusOption[0]} color="error" variant="soft" />}
          {cell?.getValue() === 1 && (
            <Chip label={statusOption[1]} color="warning" variant="soft" />
          )}
          {cell?.getValue() === 2 && (
            <Chip label={statusOption[2]} color="success" variant="soft" />
          )}
        </span>
      ),
    }),

  
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows: MRT_Row<UserManagement | any>[]) => {
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
    muiSearchTextFieldProps: {
      placeholder: 'Tìm kiếm người dùng',
    },
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
          Xuất tất cả dữ liệu
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows?.length === 0}
          //  export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Xuất tất cả các dòng
        </Button>
        <Button
          disabled={table.getRowModel().rows?.length === 0}
          //  export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Xuất tất cả dữ liệu trong trang
        </Button>
      </Box>
    ),
  });

  useEffect(() => {}, [openModal, openActiveModal]);
  return (
    <>
      <MaterialReactTable table={table} /> {activeModal}
    </>
  );
};

export default ButlerTable;
