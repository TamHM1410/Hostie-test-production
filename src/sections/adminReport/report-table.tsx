//@hook
import { useState } from 'react';
import { UserManagement } from 'src/types/users';

///@mui

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';

import { Box, Button, Chip, Divider, MenuItem } from '@mui/material';
///store
import { useCurrentReport } from 'src/zustand/report';
///@another
import ReportMenu from './menu';
import EditReportModal from './edit-modal';

// import RoleActionMenu from './role-action-menu';
const columnHelper = createMRTColumnHelper<UserManagement | any>();

const statusOption = ['Đang điều tra', 'Chờ xử lý', 'Đã giải quyết','Đã đóng'];

const ReportTable = (props: any) => {
  const { data = [] } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [selectEdit, setSelectEdit] = useState<any>({
    id: 0,
    status: '',
    adminNote: '',
  });

  const { updateReport } = useCurrentReport();

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
          {cell.getValue() === 'INVESTIGATING' && (
            <Chip label={statusOption[0]} variant="soft" color="error" />
          )}
          {cell.getValue() === 'PENDING' && (
            <Chip label={statusOption[1]} variant="soft" color="warning" />
          )}
          {cell.getValue() === 'RESOLVED' && (
            <Chip label={statusOption[2]} variant="soft" color="success" />
          )}
         
        
        </span>
      ),
    }),

    columnHelper.accessor('adminNote', {
      header: 'Ghi chú của quản trị viên ',
      size: 220,
      Cell: ({ cell }: any) => {
        console.log('cell', cell.getValue());
        return (
          <Box
            sx={{
              fontStyle: 'italic',
              color: '#637381',
              display: 'flex',
              gap: 2,
            }}
          >
            <Box sx={{width:120}}>{cell.getValue() !== null ? cell.getValue() : 'Chưa có ghi chú'}</Box>

            <Box
              onClick={() => {
                const row = cell.row.original;
                updateReport({
                  id: row?.id,
                  status: row?.status,
                  adminNote: row?.adminNote,
                });
                setSelectEdit({
                  id: row?.id,
                  status: row?.status,
                  adminNote: row?.adminNote,
                });
                setOpen(!open);
              }}
            >
              {' '}
              <ReportMenu />
            </Box>
          </Box>
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

  return (
    <>
      <MaterialReactTable table={table} />
      <EditReportModal open={open} setOpen={setOpen} selectEdit={selectEdit} />
    </>
  );
};

export default ReportTable;
