//  @react
import { useEffect, useState, useMemo } from 'react';
//  @mui
import Switch from '@mui/material/Switch';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';
import Image from 'next/image';
import { Box, Button, Chip, Menu, MenuItem, Avatar } from '@mui/material';

import UserDetailModal from './view-user-detail-modal';
import useUpdateActiveModal from '../hooks/useUpdateActiveModal';
import ViewEvidenceModal from './view-evidence';

//  @store
import { UserManagement } from 'src/types/users';
import { useCurrentUser } from 'src/zustand/store';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const columnHelper = createMRTColumnHelper<UserManagement | any>();

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

      size: 350,
      Cell: ({ row }: any) => {
        const username = row.getValue('username');
        const email = row?.original.email;
        const urlAvatar =
          row.original?.urlAvatar ||
          `https://www.arundelparkrda.com.au/wp-content/uploads/2017/07/noprofile.png`;

        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
              <Avatar src={urlAvatar} alt="" width={50} height={50} />
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
            <Chip label="Đã xác thực" color="success" variant="soft" />
          ) : (
            <Chip label="Chưa xác thực" color="error" variant="soft" />
          )}
        </span>
      ),
    }),
    columnHelper.accessor('userSignupImages', {
      header: 'Ảnh minh  chứng ',
      Cell: ({ cell }: any) => (
        <span>
          <ViewEvidenceModal images={cell?.getValue()} />
        </span>
      ),
    }),
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
          {Array.isArray(cell.getValue()) &&
            cell.getValue()[0]?.name &&
            cell.getValue()[0]?.name === 'USER' && (
              <Chip
                label="Chưa đăng ký "
                variant="soft"
                // color="success"
                sx={{ width: 130 }}
              />
            )}
          {Array.isArray(cell.getValue()) &&
            cell.getValue()[0]?.name &&
            cell.getValue()[0]?.name === 'SELLER' && (
              <Chip
                label="Người bán"
                variant="soft"
                color="primary"
                sx={{ width: 130 }}
              />
            )}
          {Array.isArray(cell.getValue()) &&
            cell.getValue()[0]?.name &&
            cell.getValue()[0]?.name === 'HOST' && (
              <Chip
                label="Chủ nhà"
                variant="soft"
                color="warning"
                sx={{ width: 130 }}
              />
            )}
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
            }
          }}
        >
          <UserDetailModal open={openModal} setOpen={setOpenModal} />
        </div>
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
    muiSearchTextFieldProps: {
      placeholder: 'Tìm kiếm người dùng',
    },
  });

  useEffect(() => {}, [openModal, openActiveModal]);
  return (
    <>
      <MaterialReactTable table={table} /> {activeModal}
    </>
  );
};

export default UserTable;
