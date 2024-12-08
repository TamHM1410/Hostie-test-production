import React, { useState, useMemo } from 'react';
import { Chip, IconButton, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';

interface ReportData {
    bookingId: number;
    title: string;
    reportType: string;
    status: string;
    resolvedAt: string | null;
    id: number;
    adminNote: string | null;
    createdAt: string;
    description: string;
    hostName: string;
    reporterName: string;
    residenceId: number;
    residenceName: string;
    severity: string;
    updatedAt: string;
}

interface ReportListTableProps {
    rows: ReportData[];
}
const translateReportType = (type: string) => {
    switch (type) {
        case 'PAYMENT_ISSUE':
            return 'Vấn Đề Thanh Toán';
        case 'RESIDENCE_ISSUE':
            return 'Vấn Đề Chỗ Ở';
        case 'HOST_ISSUE':
            return 'Vấn Đề Chủ Nhà';
        case 'SERVICE_ISSUE':
            return 'Vấn Đề Dịch Vụ';
        case 'OTHER':
            return 'Khác';
        default:
            return type;
    }
};

const translateStatus = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'Đang Chờ Xử Lý';
        case 'RESOLVED':
            return 'Đã Giải Quyết';
        case 'REJECTED':
            return 'Đã Từ Chối';
        default:
            return status;
    }
};

const translateSeverity = (severity: string) => {
    switch (severity) {
        case 'LOW':
            return 'Thấp';
        case 'MEDIUM':
            return 'Trung Bình';
        case 'HIGH':
            return 'Cao';
        case 'URGENT':
            return 'Khẩn Cấp';
        default:
            return severity;
    }
};

const ReportListTable: React.FC<ReportListTableProps> = ({ rows }) => {
    const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

    const columns: MRT_ColumnDef<ReportData>[] = useMemo(
        () => [
            {
                accessorKey: 'bookingId',
                header: 'Mã Đặt Nơi Lưu Trú',
                size: 100,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'title',
                header: 'Tiêu Đề',
                size: 200,
                Cell: ({ cell }: any) => <Typography>{cell.getValue()}</Typography>,
            },
            {
                accessorKey: 'reportType',
                header: 'Loại Báo Cáo',
                size: 150,
                Cell: ({ cell }: any) => <Typography>{translateReportType(cell.getValue())}</Typography>,
            },
            {
                accessorKey: 'status',
                header: 'Trạng Thái',
                size: 150,
                Cell: ({ cell }: any) => {
                    const translatedStatus = translateStatus(cell.getValue());
                    const color =
                        cell.getValue() === 'PENDING'
                            ? 'warning'
                            : cell.getValue() === 'RESOLVED'
                                ? 'success'
                                : 'error';
                    return <Chip label={translatedStatus} color={color} variant="outlined" sx={{ borderRadius: 30 }} />;
                },
            }
            ,
            {
                accessorKey: 'resolvedAt',
                header: 'Thời Gian Giải Quyết',
                size: 200,
                Cell: ({ cell }: any) => (
                    <Typography>{cell.getValue() ? cell.getValue() : 'Chưa có'}</Typography>
                ),
            },
            {
                accessorKey: 'action',
                header: 'Hành Động',
                size: 150,
                Cell: ({ row }: any) => (
                    <IconButton
                        color="primary"
                        onClick={() => setSelectedReport(row.original)}
                    >
                        <VisibilityIcon />
                    </IconButton>
                ),
            },
        ],
        []
    );

    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={rows || []}
                enablePagination
                enableSorting
                enableTopToolbar
            />
            {selectedReport && (
                <Dialog
                    open={Boolean(selectedReport)}
                    onClose={() => setSelectedReport(null)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle
                        sx={{
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            borderBottom: '1px solid #ddd',
                            padding: '16px 24px',
                        }}
                    >
                        Chi Tiết Báo Cáo
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            padding: '24px',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 2,
                                marginTop: 3
                            }}
                        >
                            <Typography>
                                <strong>Mã Báo Cáo:</strong> {selectedReport.id}
                            </Typography>
                            <Typography>
                                <strong>Mã Đặt Nơi Lưu Trú:</strong> {selectedReport.bookingId}
                            </Typography>
                            <Typography>
                                <strong>Tiêu Đề:</strong> {selectedReport.title}
                            </Typography>
                            <Typography>
                                <strong>Loại Báo Cáo:</strong> {translateReportType(selectedReport.reportType)}
                            </Typography>
                            <Typography>
                                <strong>Trạng Thái:</strong> {translateStatus(selectedReport.status)}
                            </Typography>
                            <Typography>
                                <strong>Thời Gian Giải Quyết:</strong>{' '}
                                {selectedReport.resolvedAt ? selectedReport.resolvedAt : 'Chưa có'}
                            </Typography>
                            <Typography>
                                <strong>Ghi Chú Admin:</strong>{' '}
                                {selectedReport.adminNote ? selectedReport.adminNote : 'Không có'}
                            </Typography>

                            <Typography>
                                <strong>Tên Chủ Nhà:</strong> {selectedReport.hostName}
                            </Typography>
                            <Typography>
                                <strong>Tên Nơi Lưu Trú:</strong> {selectedReport.residenceName}
                            </Typography>
                            <Typography>
                                <strong>Độ Nghiêm Trọng:</strong> {translateSeverity(selectedReport.severity)}
                            </Typography>
                            <Typography>
                                <strong>Thời Gian Tạo:</strong> {selectedReport.createdAt}
                            </Typography>
                            <Typography>
                                <strong>Thời Gian Cập Nhật:</strong> {selectedReport.updatedAt}
                            </Typography>
                            <Typography>
                                <strong>Mô Tả:</strong> {selectedReport.description}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                marginTop: 3,
                            }}
                        >
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                <strong>Hình Ảnh Chứng Minh:</strong>
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                }}
                            >
                                {selectedReport.evidenceImages?.length > 0 ? (
                                    selectedReport.evidenceImages.map((image: string, index: number) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt={`Evidence ${index + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <Typography>Không có hình ảnh chứng minh.</Typography>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            backgroundColor: '#f5f5f5',
                            borderTop: '1px solid #ddd',
                            justifyContent: 'center',
                            padding: '12px 24px',
                        }}
                    >
                        <Button
                            onClick={() => setSelectedReport(null)}
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: 'none', borderRadius: 20 }}
                        >
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default ReportListTable;
