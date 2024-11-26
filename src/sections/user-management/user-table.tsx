import { useEffect, useState, useMemo } from 'react';
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

import UserDetailModal from './view-user-detail-modal';
import useUpdateActiveModal from '../hooks/useUpdateActiveModal';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const columnHelper = createMRTColumnHelper<UserManagement | any>();
const statusOption = ['Rejected', 'Pending', 'Accepted'];

const UserTable = (props: any) => {
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
    columnHelper.accessor('username', {
      header: ' Tài khoản ',

      size: 250,
      Cell: ({ row }: any) => {
        const username = row.getValue('username');
        const email = row?.original.email;
        const urlAvatar =
          row.original?.urlAvatar ||
          `https://www.arundelparkrda.com.au/wp-content/uploads/2017/07/noprofile.png`;

        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
              <Image src={urlAvatar} alt="" width={50} height={50} />
            </Box>
            <Box>
              <Box sx={{ fontSize: 18, fontWeight: 700 }}>{username}</Box>
              <Box sx={{ fontStyle: 'italic', fontSize: 12 }}>({email})</Box>
            </Box>
          </Box>
        );
      },
    }),

    columnHelper.accessor('emailVerified', {
      header: 'Trạng thái email',
      size: 80,
      Cell: ({ cell }: any) => (
        <span>
          {cell.getValue() === true ? (
            <Chip label="Đã xác thực" color="success" variant='soft'/>
          ) : (
            <Chip label="Chưa xác thực" color="error" variant='soft'/>
          )}
        </span>
      ),
    }),
    // columnHelper.accessor('status', {
    //   header: 'Trạng thái tài khoản',
    //   Cell: ({ cell }: any) => (
    //     <span>
    //       {cell?.getValue() === 0 && <Chip label={statusOption[0]} color="error" variant='soft' />}
    //       {cell?.getValue() === 1 && <Chip label={statusOption[1]} color="warning" variant='soft'/>}
    //       {cell?.getValue() === 2 && <Chip label={statusOption[2]} color="success" variant='soft'/>}
    //     </span>
    //   ),
    // }),
    columnHelper.accessor('isActive', {
      header: 'Trạng thái hoạt động',
      size: 180,
      Cell: ({ cell }: any) => (
        <div
          role="button" // Makes it clear that the div acts like a button
          tabIndex={0} // Makes the div focusable
          onClick={() => {
            console.log(cell.row.original);
            updateUserSelected(cell.row.original);
            setOpenActive(!openActiveModal);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setOpenActive(!openActiveModal);
            }
          }}
        >
          <Switch {...label} color="success" checked={cell.getValue()} />
        </div>
      ),
    }),
    columnHelper.accessor('roles', {
      header: 'Vai trò',
      size: 180,
      Cell: ({ cell }: any) => (
        <span>
          <Chip
            label={
              Array.isArray(cell.getValue()) && cell.getValue()[0]?.name
                ? cell.getValue()[0].name
                : 'Unknown'
            }
            variant="soft"
            // color="success"
            sx={{ width: 130 }}
          />
        </span>
      ),
    }),
    columnHelper.accessor('action', {
      header: ' ',
      size: 220,
      Cell: ({ cell }: any) => (
        <div
          role="button" // This indicates that the div behaves like a button
          tabIndex={cell.row.id} // Makes the div focusable
          onClick={() => {
            if (openModal === false) updateUserSelected(cell.row.original);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              // updateUserSelected(cell.row.original);
              console.log('cc');
            }
          }}
          // Optionally, add some styling to
        >
          <UserDetailModal open={openModal} setOpen={setOpenModal} />
        </div>
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

export default UserTable;
