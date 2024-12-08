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
                                    <TableCell>
                                        {new Date(log.date).toLocaleString("vi-VN", {
                                            timeZone: "Asia/Ho_Chi_Minh",
                                        })}
                                    </TableCell>

                                    {/* Hiển thị loại sự kiện */}
                                    <TableCell>{log?.event_type}</TableCell>

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
                                                                    <TableCell>{change?.field}</TableCell>
                                                                    <TableCell>{change?.old_value ?? "N/A"}</TableCell>
                                                                    <TableCell>{change?.new_value ?? "N/A"}</TableCell>
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
