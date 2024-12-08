import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import { useRouter } from 'next/navigation';

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
import { useButlerBooking } from 'src/zustand/store';
import { IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CheckinModal from './checkin-modal';
import CheckoutModal from './checkout-modal';

// import UserDetailModal from './view-user-detail-modal';
import useUpdateActiveModal from '../hooks/useUpdateActiveModal';

const columnHelper = createMRTColumnHelper<any>();

function BasicMenu() {
  const { butler } = useButlerBooking();

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        < ChatIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => router.push(`/dashboard/chat/?id=${butler.seller_id}`)}>
          Nhắn tin
        </MenuItem>
      </Menu>
    </div>
  );
}

const ButlerBookingTable = (props: any) => {
  const { data = [] } = props;

  const { updateButlerBookingZustand } = useButlerBooking();

  const [openActiveModal, setOpenActive] = useState(false);

  const [openCheckinModal, setOpenCheckinModal] = useState(false);

  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const activeModal = useUpdateActiveModal({
    open: openActiveModal,
    setOpen: setOpenActive,
    type: 'user',
  });

  const columns = [
    columnHelper.accessor('residence_name', {
      header: ' Căn hộ ',

      size: 180,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Image
                src="https://dulichvinhhalong.net.vn/wp-content/uploads/2023/05/mau-villa-dep-1.jpg"
                alt="cc"
                width={100}
                height={100}
                loading="lazy"
              />
            </Box>
            <Box>
              <Box sx={{ fontSize: 18, pt: 3 }}>{cell.getValue()}</Box>
              <Box sx={{ fontSize: 12, fontStyle: 'italic' }}>
                Địa chỉ: {row?.residence_address ?? '(Chưa cập nhật)'}
              </Box>
            </Box>
          </Box>
        );
      },
    }),

    columnHelper.accessor('seller_id', {
      header: 'Người mô giới',
      size: 80,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;
        // updateButlerBookingZustand(cell.row.original);

        return (
          <Box>
            <Box onClick={()=>updateButlerBookingZustand(cell.row.original)} >
             <BasicMenu/>
            </Box>
          </Box>
        );
      },
    }),
    columnHelper.accessor('guest_name', {
      header: 'Tên khách',
      size: 60,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <Box>
            <Box>
              <Box sx={{ fontSize: 18, fontWeight: 700 }}>{cell.getValue()}</Box>
              <Box sx={{ fontSize: 12, fontStyle: 'italic' }}>
                Số lượng khách: {row?.total_amount ?? '(Chưa cập nhật)'}
              </Box>
            </Box>
          </Box>
        );
      },
    }),

    columnHelper.accessor('total_date', {
      header: 'Tổng thời gian',
      size: 60,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <Box>
            <Box sx={{ fontSize: 18 }}>
              {row?.total_day} ngày {row?.total_night} đêm
            </Box>
          </Box>
        );
      },
    }),
    columnHelper.accessor('checkin', {
      header: 'Ngày nhận phòng',
      size: 100,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <Box>
            <Box>
              <Box sx={{ fontSize: 16, fontWeight: 500, ml: 2 }}>{cell.getValue()}</Box>

              <Box
                sx={{ fontSize: 12, ml: 2, cursor: 'pointer' }}
                onClick={() => {
                  updateButlerBookingZustand(cell.row.original);

                  row?.is_customer_checkin === false
                    ? setOpenCheckinModal(!openCheckinModal)
                    : setOpenCheckinModal(false);
                }}
              >
                {row?.is_customer_checkin === false ? (
                  <Chip label="Chưa nhận phòng" variant="soft" color="error" />
                ) : (
                  <Chip label="Đã nhận phòng" variant="soft" color="success" />
                )}
              </Box>
            </Box>
          </Box>
        );
      },
    }),

    columnHelper.accessor('checkout', {
      header: 'Ngày trả phòng',
      size: 100,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <Box>
            <Box>
              <Box sx={{ fontSize: 16, fontWeight: 500, ml: 2 }}>{cell.getValue()}</Box>

              <Box
                sx={{ fontSize: 12, ml: 2, cursor: 'pointer' }}
                onClick={() => {
                  updateButlerBookingZustand(cell.row.original);

                  row?.is_customer_checkout === false
                    ? setOpenCheckoutModal(!openCheckoutModal)
                    : setOpenCheckoutModal(false);
                }}
              >
                {row?.is_customer_checkout === false ? (
                  <Chip label="Chưa trả phòng" variant="soft" color="error" />
                ) : (
                  <Chip label="Đã trả phòng" variant="soft" color="success" />
                )}
              </Box>
            </Box>
          </Box>
        );
      },
    }),

    columnHelper.accessor('paid_amount', {
      header: 'Tổng tiền',
      size: 60,
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
    muiSearchTextFieldProps: {
      placeholder: 'Tìm kiếm người dùng',
    },
    
  });

  useEffect(() => {}, [openModal, openActiveModal]);
  return (
    <>
      <MaterialReactTable table={table} /> {activeModal}
      <CheckinModal open={openCheckinModal} setOpen={setOpenCheckinModal} />
      <CheckoutModal open={openCheckoutModal} setOpen={setOpenCheckoutModal} />
    </>
  );
};

export default ButlerBookingTable;
