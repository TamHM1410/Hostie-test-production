import React, { useState, useMemo } from 'react';
import {
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Grid,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';

interface BlockResidence {
    id: number;
    residence_id: number;
    start_date: string;
    end_date: string;
    reason: string;
    status: number;
    created_at: string;
    updated_at: string;
}

interface ManageBlockResidenceTableProps {
    rows: BlockResidence[];
    onAddBlock: (data: Omit<BlockResidence, 'id' | 'status' | 'created_at' | 'updated_at'>) => void;
    onDeleteBlock: (id: number, data: Omit<BlockResidence, 'id' | 'status' | 'created_at' | 'updated_at'>) => void;
    id: any
}

// Validation Schema with Yup
const addBlockSchema = yup.object().shape({
    start_date: yup.date().required('Ngày Bắt Đầu không được để trống'),
    end_date: yup
        .date()
        .required('Ngày Kết Thúc không được để trống')
        .min(yup.ref('start_date'), 'Ngày Kết Thúc phải sau Ngày Bắt Đầu'),
    reason: yup.string().required('Lý Do không được để trống'),
});

const ManageBlockResidenceTable: React.FC<ManageBlockResidenceTableProps> = ({ rows, onAddBlock, onDeleteBlock, id }) => {
    const [selectedBlock, setSelectedBlock] = useState<BlockResidence | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteBlockId, setDeleteBlockId] = useState<number | null>(null);
    const [selectedBlock2, setSelectedBlock2] = useState<BlockResidence | null>(null);
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Omit<BlockResidence, 'id' | 'status' | 'created_at' | 'updated_at'>>({
        resolver: yupResolver(addBlockSchema),
        defaultValues: {
            residence_id: parseInt(id),
            start_date: '',
            end_date: '',
            reason: '',
        },
    });

    const handleAddBlockSubmit = (data: Omit<BlockResidence, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
        const formattedData = {
            ...data,
            residence_id: Number(data.residence_id), // Đảm bảo residence_id là số
            start_date: format(new Date(data.start_date), 'dd-MM-yyyy'), // Định dạng ngày
            end_date: format(new Date(data.end_date), 'dd-MM-yyyy'), // Định dạng ngày
        };

        onAddBlock(formattedData);
        setIsAddModalOpen(false);
        reset(); // Reset form fields
    };
    const handleDeleteBlock = () => {
        if (deleteBlockId !== null) {
            onDeleteBlock(deleteBlockId, selectedBlock2?.residence_id);
        }
        setIsDeleteModalOpen(false);
        setDeleteBlockId(null);
    };

    const columns: MRT_ColumnDef<BlockResidence>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                size: 80,
            },
            {
                accessorKey: 'start_date',
                header: 'Ngày Bắt Đầu',
                size: 150,
            },
            {
                accessorKey: 'end_date',
                header: 'Ngày Kết Thúc',
                size: 150,
            },
            {
                accessorKey: 'reason',
                header: 'Lý Do',
                size: 250,
            },
            {
                accessorKey: 'action',
                header: 'Hành Động',
                size: 200,
                Cell: ({ row }: any) => (
                    <>
                        <IconButton color="primary" onClick={() => setSelectedBlock(row.original)}>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => {
                                setSelectedBlock2(row.original)
                                setDeleteBlockId(row.original.id);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </>
                ),
            },
        ],
        []
    );

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
                sx={{ marginBottom: 2 }}
            >
                Thêm Khóa Nơi Lưu Trú
            </Button>
            <MaterialReactTable columns={columns} data={rows || []} enablePagination enableSorting enableTopToolbar />

            {/* Detail Modal */}
            {selectedBlock && (
                <Dialog
                    open={Boolean(selectedBlock)}
                    onClose={() => setSelectedBlock(null)}
                    maxWidth="sm"
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
                        Chi Tiết Khóa Nơi Lưu Trú
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
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 3,
                                backgroundColor: '#f9f9f9',
                                padding: 3,
                                borderRadius: 2,
                                border: '1px solid #ddd',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography sx={{ color: '#333', fontWeight: 500 }}>
                                <strong>Số thứ tự:</strong> {selectedBlock.id}
                            </Typography>
                            <Typography sx={{ color: '#333', fontWeight: 500 }}>
                                <strong>Ngày tạo:</strong> {format(new Date(selectedBlock.created_at), 'dd-MM-yyyy HH:mm')}
                            </Typography>
                            <Typography sx={{ color: '#333', fontWeight: 500 }}>
                                <strong>Ngày Bắt Đầu:</strong> {selectedBlock.start_date}
                            </Typography>
                            <Typography sx={{ color: '#333', fontWeight: 500 }}>
                                <strong>Ngày Kết Thúc:</strong> {selectedBlock.end_date}
                            </Typography>
                            <Typography
                                sx={{
                                    color: '#555',
                                    fontWeight: 400,
                                    gridColumn: 'span 2', // Make the reason span both columns
                                    whiteSpace: 'pre-wrap', // Ensure long reasons wrap properly
                                }}
                            >
                                <strong>Lý Do:</strong> {selectedBlock.reason}
                            </Typography>
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
                            onClick={() => setSelectedBlock(null)}
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: 'none', borderRadius: 20 }}
                        >
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Add Block Modal */}
            <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="sm" fullWidth >
                <DialogTitle>Thêm Khóa Nơi Lưu Trú</DialogTitle>
                <form onSubmit={handleSubmit(handleAddBlockSubmit)}>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            <Grid item xs={6}>
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Ngày Bắt Đầu"
                                            InputLabelProps={{ shrink: true }}
                                            {...field}
                                            error={!!errors.start_date}
                                            helperText={errors.start_date?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Ngày Kết Thúc"
                                            InputLabelProps={{ shrink: true }}
                                            {...field}
                                            error={!!errors.end_date}
                                            helperText={errors.end_date?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="reason"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Lý Do"
                                            multiline
                                            rows={3}
                                            {...field}
                                            error={!!errors.reason}
                                            helperText={errors.reason?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsAddModalOpen(false)} color="primary">
                            Hủy
                        </Button>
                        <Button type="submit" color="success" variant="contained">
                            Thêm
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Xác Nhận Xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa Block này?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteModalOpen(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteBlock} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageBlockResidenceTable;
