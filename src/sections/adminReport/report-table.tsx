//@hook
import { useState } from 'react';
import { UserManagement } from 'src/types/users';
import { useReport } from 'src/api/useReport';
import { useQueryClient } from '@tanstack/react-query';

///@mui

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';

import { Box, Button, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';

///store
import { useCurrentReport } from 'src/zustand/report';
///@another
import EditReportModal from './edit-modal';

// import RoleActionMenu from './role-action-menu';
const columnHelper = createMRTColumnHelper<UserManagement | any>();

const statusOption = ['Cảnh báo', 'Đang xử lý', 'Đã giải quyết', 'Từ chối'];

const ReportTable = (props: any) => {
  const { acceptReport, rejectReport, warningReport } = useReport();

  const queryClient = useQueryClient();

  const { data = [] } = props;

  const [open, setOpen] = useState<boolean>(false);

  const [selectEdit, setSelectEdit] = useState<any>({
    id: 0,
    status: '',
    adminNote: '',
  });

  const columns = [
    columnHelper.accessor('residenceName', {
      header: ' Căn hộ',
      size: 220,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <Box>
            <Box sx={{ fontWeight: 700 }}> {row.residenceName}</Box>
            <Box sx={{ fontStyle: 'italic', color: '#637381' }}>Chủ nhà : {row.hostName}</Box>
          </Box>
        );
      },
    }),
    columnHelper.accessor('residenceId', {
      header: 'Mã booking',
      size: 40,
      Cell: ({ cell }: any) => (
        <span style={{ color: '#637381' }}>
          {cell.getValue() == null ? 'none' : cell.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('reportType', {
      header: 'Loại  báo cáo',
      size: 220,
      Cell: ({ cell }: any) => (
        <span style={{ color: '#637381' }}>
          {cell.getValue() === 'PAYMENT_ISSUE' && 'VẤN ĐỀ THANH TOÁN'}
          {cell.getValue() === 'RESIDENCE_ISSUE' && 'VẤN ĐỀ CĂN HỘ'}
          {cell.getValue() === 'SERVICE_ISSUE' && 'VẤN ĐỀ DỊCH VỤ'}

          {cell.getValue() === 'HOST_ISSUE' && 'VẤN ĐỀ  CHỦ NHÀ'}
          {cell.getValue() === 'OTHER' && 'KHÁC'}
        </span>
      ),
    }),
    columnHelper.accessor('description', {
      header: 'Lý do',
      size: 220,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <Box>
            <Box sx={{ fontWeight: 700 }}> {row.title}</Box>
            <Box sx={{ fontStyle: 'italic', color: '#637381' }}> {row.description}</Box>
          </Box>
        );
      },
    }),

    columnHelper.accessor('reporterName', {
      header: 'Người báo cáo',
      size: 80,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <Box>
            <Box sx={{ fontWeight: 700 }}> {row.reporterName}</Box>
            <Box sx={{ fontStyle: 'italic', color: '#637381' }}> ({row.createdAt})</Box>
          </Box>
        );
      },
    }),

    columnHelper.accessor('status', {
      header: 'Trạng thái',
      size: 210,
      Cell: ({ cell }: any) => (
        <span
          style={{
            color: '#637381',
          }}
        >
          {cell.getValue() === 'WARNED' && (
            <Chip label={statusOption[0]} variant="soft" color="warning" />
          )}
          {cell.getValue() === 'PENDING' && (
            <Chip label={statusOption[1]} variant="soft" color="warning" />
          )}
          {cell.getValue() === 'ACCEPTED' && (
            <Chip label={statusOption[2]} variant="soft" color="success" />
          )}

          {cell.getValue() === 'REJECTED' && (
            <Chip label={statusOption[3]} variant="soft" color="error" />
          )}
        </span>
      ),
    }),

    columnHelper.accessor('adminNote', {
      header: 'Ghi chú của quản trị viên ',
      size: 220,
      Cell: ({ cell }: any) => {
        return (
          <Box
            sx={{
              fontStyle: 'italic',
              color: '#637381',
              display: 'flex',
              gap: 2,
            }}
          >
            <Box sx={{ width: 120 }}>
              {cell.getValue() !== null ? cell.getValue() : 'Chưa có ghi chú'}
            </Box>

         
          </Box>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Thao tác',
      size: 210,
      Cell: ({ cell }: any) => {
        const row = cell.row.original;

        return (
          <span
            style={{
              color: '#637381',
            }}
          >
            {row.status === 'PENDING' && (
              <Box>
                <Tooltip title="Đồng ý">
                  <IconButton
                    color="success"
                    aria-label="delete"
                    size="large"
                    onClick={() => handleAccept(row.id)}
                  >
                    <CheckCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cảnh cáo">
                  <IconButton
                    color="warning"
                    aria-label="delete"
                    size="large"
                    onClick={() => handleWaning(row.id)}
                  >
                    <ErrorOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Từ chối">
                  <IconButton
                    color="error"
                    aria-label="delete"
                    size="large"
                    onClick={() => handleReject(row.id)}
                  >
                    <BlockIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </span>
        );
      },
    }),
  ];

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
  });

  const handleAccept = async (id: any) => {
    const res = await acceptReport(id);
    if (res) {
      queryClient.invalidateQueries(['reportList'] as any);
    }
  };

  const handleWaning = async (id: any) => {
    const res = await warningReport(id);
    if (res) {
      queryClient.invalidateQueries(['reportList'] as any);
    }
  };
  const handleReject = async (id: any) => {
    const res = await rejectReport(id);
    if (res) {
      queryClient.invalidateQueries(['reportList'] as any);
    }
  };

  return (
    <>
      <MaterialReactTable table={table} />
      <EditReportModal open={open} setOpen={setOpen} selectEdit={selectEdit} />
    </>
  );
};

export default ReportTable;
