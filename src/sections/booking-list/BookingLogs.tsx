import React from "react";
import {
    Box,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface DataChange {
    field: string;
    old_value: any;
    new_value: any;
}

interface Log {
    date: string;
    event_type: string;
    user_id: number;
    username: string;
    user_avatar: string;
    data_change: DataChange[] | null;
}

const fieldMapping: Record<string, string> = {
    id: "Mã",
    residence_id: "Mã nơi lưu trú",
    seller_id: "Mã người môi giới",
    total_amount: "Tổng số tiền",
    paid_amount: "Số tiền đã thanh toán",
    checkin: "Ngày nhận phòng",
    checkout: "Ngày trả phòng",
    total_nights: "Tổng số đêm",
    total_days: "Tổng số ngày",
    hold_residence_id: "Mã giữ nơi lưu trú",
    guest_name: "Tên khách hàng",
    guest_phone: "Số điện thoại khách hàng",
    host_phone: "Số điện thoại chủ nhà",
    residence_address: "Địa chỉ nơi lưu trú",
    is_host_accept: "Chủ nhà đã xác nhận",
    is_seller_transfer: "Người môi giới đã chuyển khoản",
    is_host_receive: "Chủ nhà đã nhận",
    is_customer_checkin: "Khách hàng đã nhận phòng",
    is_customer_checkout: "Khách hàng đã trả phòng",
    description: "Mô tả",
    bank_account_id: "Mã tài khoản ngân hàng",
    guest_count: "Số lượng khách",
    bank_account_holder: "Chủ tài khoản",
    bank_account_no: "Số tài khoản",
    reason_reject: "Lý do từ chối",
    bank_id: "Mã ngân hàng",
    commission_rate: "Tỷ lệ hoa hồng",
    created_at: "Ngày tạo",
    updated_at: "Ngày cập nhật",
};
const formatBoolean = (field: string, value: boolean): string => {
    const booleanMappings: Record<string, Record<boolean, string>> = {
        is_host_accept: { true: "Đã xác nhận", false: "Chưa xác nhận" },
        is_seller_transfer: { true: "Đã chuyển khoản", false: "Chưa chuyển khoản" },
        is_host_receive: { true: "Đã nhận", false: "Chưa nhận" },
        is_customer_checkin: { true: "Đã nhận phòng", false: "Chưa nhận phòng" },
        is_customer_checkout: { true: "Đã trả phòng", false: "Chưa trả phòng" },
    };
    return booleanMappings[field]?.[value] || (value ? "Có" : "Không");
};

const formatMoney = (value: number): string =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);

const formatDate = (value: string): string => {
    const date = new Date(value);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
const eventTypeMapping: Record<string, string> = {
    BOOKING_CREATED: "Đặt nơi lưu trú mới",
    HOST_ACCEPTED_BOOKING: "Chủ nhà đã xác nhận đặt chỗ",
    SELLER_TRANSFERRED: "Người môi giới đã chuyển khoản",
    HOST_RECEIVED: "Chủ nhà đã nhận tiền",
    CUSTOMER_CHECKIN: "Khách hàng đã nhận phòng",
    CUSTOMER_CHECKOUT: "Khách hàng đã trả phòng",
    BOOKING_SYSTEM_CANCELLED: "Hệ thống đã hủy đặt chỗ",
};

interface LogsTableModalProps {
    logs: Log[];
    open: boolean;
    onClose: () => void;
}

const BookingLogsModal: React.FC<LogsTableModalProps> = ({ logs, open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <Typography variant="h5">Nhật kí đặt nơi lưu trú</Typography>
            </DialogTitle>
            <DialogContent dividers>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Ngày</strong></TableCell>
                                <TableCell><strong>Loại sự kiện</strong></TableCell>
                                <TableCell><strong>Người dùng</strong></TableCell>
                                <TableCell><strong>Chi tiết</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs?.map((log, index) => (
                                <TableRow key={index}>
                                    {/* Hiển thị ngày */}
                                    <TableCell>{formatDate(log.date)}</TableCell>

                                    {/* Hiển thị loại sự kiện */}
                                    <TableCell>
                                        {eventTypeMapping[log?.event_type] || log?.event_type}
                                    </TableCell>


                                    {/* Hiển thị thông tin người dùng */}
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Avatar src={log?.user_avatar} alt={log?.username} />
                                            <Box ml={2}>
                                                <Typography>{log?.username}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* Hiển thị chi tiết thay đổi */}
                                    <TableCell>
                                        {log?.data_change && log?.data_change.length > 0 ? (
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography>Xem thay đổi</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><strong>Trường</strong></TableCell>
                                                                <TableCell><strong>Giá trị cũ</strong></TableCell>
                                                                <TableCell><strong>Giá trị mới</strong></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {log.data_change.map((change, idx) => (
                                                                <TableRow key={idx}>
                                                                    <TableCell>{fieldMapping[change?.field] || change?.field}</TableCell>
                                                                    <TableCell>
                                                                        {["total_amount", "paid_amount"].includes(change?.field)
                                                                            ? formatMoney(change?.old_value)
                                                                            : ["checkin", "checkout", "created_at", "updated_at"].includes(change?.field)
                                                                                ? formatDate(change?.old_value)
                                                                                : typeof change?.old_value === "boolean"
                                                                                    ? formatBoolean(change?.field, change?.old_value)
                                                                                    : change?.old_value ?? "Trống"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {["total_amount", "paid_amount"].includes(change?.field)
                                                                            ? formatMoney(change?.new_value)
                                                                            : ["checkin", "checkout", "created_at", "updated_at"].includes(change?.field)
                                                                                ? formatDate(change?.new_value)
                                                                                : typeof change?.new_value === "boolean"
                                                                                    ? formatBoolean(change?.field, change?.new_value)
                                                                                    : change?.new_value ?? "Trống"}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </AccordionDetails>
                                            </Accordion>
                                        ) : (
                                            <Typography>Không có thay đổi</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingLogsModal;
