//    @hook
import { useState } from 'react';
import { UserManagement } from 'src/types/users';

/// @mui
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';

import { Box,  Chip } from '@mui/material';

import { mkConfig, generateCsv, download } from 'export-to-csv';
import ConfirmModal from './confirm-modal';

// import RoleActionMenu from './role-action-menu';

const columnHelper = createMRTColumnHelper<UserManagement | any>();

const statusOption = ['Từ chối', 'Đang xét duyệt', 'Chấp nhận'];

const BulterWorkTable = (props: any) => {

  const { data = [] } = props;

  const [open, setOpen] = useState<boolean>(false);

  const [modalType, setModalType] = useState('');

  const [selectedButler, setSelectedButler] = useState<any>(null);

  const columns = [
    columnHelper.accessor('housekeeperName', {
      header: ' Tên tài khoản',
      size: 220,
    }),

    columnHelper.accessor('housekeeperEmail', {
      header: 'Địa chỉ email',
      size: 220,
      Cell: ({ cell }: any) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
    }),
    columnHelper.accessor('residenceName', {
      header: 'Đăng ký căn hộ',
      size: 220,
      Cell: ({ cell }: any) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Trạng thái',
      size: 220,
      Cell: ({ cell }: any) => (
        <span>
          {cell.getValue() === 0 && <Chip label={statusOption[0]} variant="soft" color="error" />}
          {cell.getValue() === 1 && <Chip label={statusOption[1]} variant="soft" color="warning" />}
          {cell.getValue() === 2 && <Chip label={statusOption[2]} variant="soft" color="success" />}
        </span>
      ),
    }),

    columnHelper.accessor('action', {
      header: 'Hành động',
      size: 220,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;
        if (row.status === 1) {
          return (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Duyệt">
                <IconButton
                  color="success"
                  onClick={() => {
                    setOpen(!open);
                    setModalType('accept');
                    setSelectedButler(row);
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
                    setSelectedButler(row);
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
        return <> </>;
      },
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      ></Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        modalType={modalType}
        setModalType={setModalType}
        selectedButler={selectedButler}
      />
    </>
  );
};

export default BulterWorkTable;
