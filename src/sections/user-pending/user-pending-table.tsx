//  @react
import { useEffect, useState, useMemo } from 'react';
//  @mui
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';
import { Box, Avatar, Tooltip, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

//  @component
import ViewEvidenceModal from '../user-management/view-evidence';

import useUpdateActiveModal from '../hooks/useUpdateActiveModal';

import ConfirmModal from './confirm-modal';
//  @store
import { UserManagement } from 'src/types/users';
import { useCurrentUser } from 'src/zustand/store';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const columnHelper = createMRTColumnHelper<UserManagement | any>();

const UserPendingTable = (props: any) => {
  const { data = [] } = props;

  const { currenUserSelected, updateUserSelected } = useCurrentUser();

  const [openActiveModal, setOpenActive] = useState(false);
  
  const [userId,setUserId]=useState<any>(null)

  const [openModal, setOpenModal] = useState<boolean>(false);
  

  const [open, setOpen] = useState<boolean>(false);

  const [modalType, setModalType] = useState<string>('');

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

    columnHelper.accessor('images', {
      header: 'Ảnh minh  chứng ',
      Cell: ({ cell }: any) => (
        <span>
          <ViewEvidenceModal images={cell?.getValue()} />
        </span>
      ),
    }),
    columnHelper.accessor('referenceCode', {
      header: 'Mã giới thiệu',
      size: 220,
    }),

    columnHelper.accessor('socials', {
      header: 'Liên kết mạng xã hội',
      size: 220,
      Cell: ({ cell }: any) => {
        if (Array.isArray(cell.getValue) && cell.getValue.length > 0) {
          cell.getValue().map((item: any) => {
            return <a>{item}</a>;
          });
        }
        return <>N/A</>;
      },
    }),

    columnHelper.accessor('action', {
      header: 'Thao tác ',
      size: 220,
      Cell: ({ row }: any) => (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Duyệt">
            <IconButton
              color="success"
              onClick={() => {

                setOpen(!open);
                setModalType('accept');
                setUserId(row.original.userId)
                // setSelectedButler(row);
              }}
            >
              <CheckCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Từ chối">
            <IconButton
              color="error"
              onClick={() => {
                setOpen(!open);
                setModalType('reject');
                setUserId(row.original.userId)

                // setSelectedButler(row);
              }}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </Box>
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


  return (
    <>
      <MaterialReactTable table={table} />
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        modalType={modalType}
        setModalType={setModalType}
        userId={userId}
      />
    </>
  );
};

export default UserPendingTable;
