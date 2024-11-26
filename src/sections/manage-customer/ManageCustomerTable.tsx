/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
    Chip,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
    TextField,
    MenuItem,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { useManageCustomerContext } from 'src/auth/context/manage-customer-context/ManageCustomerContext';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

interface CustomerData {
    id: number;
    name: string;
    phone: string;
    user_id: number;
    status: number;
    updated_at: string;
    created_at: string;
}

interface ManageCustomerProps {
    rows: CustomerData[];
}

const ManageCustomerTable: React.FC<ManageCustomerProps> = ({ rows }) => {
    const [selectedRow, setSelectedRow] = React.useState<CustomerData | null>(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogType, setDialogType] = React.useState<'edit' | 'delete' | 'create'>('edit');
    const { deleteCustomer, updateCustomer, createCustomer } = useManageCustomerContext();





    const validationSchema = Yup.object({
        name: Yup.string().required('Vui lòng nhập tên khách hàng'),
        phone: Yup.string()
            .required('Vui lòng nhập số điện thoại')
            .matches(/^\d+$/, 'Số điện thoại chỉ được chứa chữ số'),
        // status: Yup.number().required('Vui lòng chọn trạng thái'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            status: 2,
        },
        validationSchema,
        onSubmit: async (values: any) => {
            if (dialogType === 'edit' && selectedRow) {
                await updateCustomer(selectedRow.id, values);
            } else if (dialogType === 'create') {
                await createCustomer(values);
            }
            setOpenDialog(false);
            setSelectedRow(null);
        },
    });

    const openDialogHandler = (type: 'edit' | 'delete' | 'create', row?: CustomerData) => {
        setDialogType(type);
        if (type === 'edit' && row) {
            setSelectedRow(row);
            formik.setValues({ name: row.name, phone: row.phone, status: row.status });
        } else if (type === 'create') {
            formik.resetForm();
        } else if (type === 'delete' && row) {
            setSelectedRow(row);
        }
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedRow(null);
    };

    const handleDelete = async () => {
        console.log(selectedRow);

        if (selectedRow) {
            await deleteCustomer(selectedRow.id);
            setOpenDialog(false);
            setSelectedRow(null);
        }
    };

    const renderStatusChip = (status: number) => {
        switch (status) {
            case 2:
                return <Chip label="Hoạt động" color="success" variant="outlined" sx={{ borderRadius: 30 }} />;
            case 1:
                return <Chip label="Không hoạt động" color="error" variant="outlined" sx={{ borderRadius: 30 }} />;
            default:
                return <Chip label="Không xác định" color="default" variant="outlined" sx={{ borderRadius: 30 }} />;
        }
    };

    const columns: MRT_ColumnDef<CustomerData>[] = React.useMemo(
        () => [
            { accessorKey: 'id', header: 'Mã Số Khách Hàng', size: 100 },
            { accessorKey: 'name', header: 'Tên Khách Hàng', size: 200 },
            { accessorKey: 'phone', header: 'Số Điện Thoại', size: 150 },
            { accessorKey: 'status', header: 'Trạng Thái', size: 150, Cell: ({ cell }: any) => renderStatusChip(cell.getValue()) },
            {
                accessorKey: 'action',
                header: 'Hành Động',
                size: 150,
                Cell: ({ row }: any) => (
                    <Box display="flex">
                        <Tooltip title="Sửa khách hàng">
                            <IconButton color="primary" onClick={() => openDialogHandler('edit', row.original)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa khách hàng">
                            <IconButton color="error" onClick={() => openDialogHandler('delete', row.original)}>
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
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
                onClick={() => openDialogHandler('create')}
                sx={{ marginBottom: 2 }}
            >
                Thêm Khách Hàng
            </Button>

            <MaterialReactTable columns={columns} data={rows || []} enablePagination enableSorting enableTopToolbar localization={MRT_Localization_VI} muiSearchTextFieldProps={{
                placeholder: 'Tìm kiếm tên khách hàng',

            }} />

            <Dialog open={openDialog} onClose={handleDialogClose}>
                {dialogType === 'edit' || dialogType === 'create' ? (
                    <>
                        <DialogTitle>{dialogType === 'edit' ? 'Sửa Thông Tin Khách Hàng' : 'Thêm Khách Hàng Mới'}</DialogTitle>
                        <DialogContent>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Tên Khách Hàng"
                                    {...formik.getFieldProps('name')}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && typeof formik.errors.name === 'string' ? formik.errors.name : undefined}
                                    margin="dense"
                                />
                                <TextField
                                    fullWidth
                                    label="Số Điện Thoại"
                                    {...formik.getFieldProps('phone')}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && typeof formik.errors.phone === 'string' ? formik.errors.phone : undefined}
                                    margin="dense"
                                />
                                {/* <TextField
                                    fullWidth
                                    select
                                    label="Trạng Thái"
                                    {...formik.getFieldProps('status')}
                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                    helperText={formik.touched.status && typeof formik.errors.status === 'string' ? formik.errors.status : undefined}
                                    margin="dense"
                                >
                                    <MenuItem value={1}>Không hoạt động</MenuItem>
                                    <MenuItem value={2}>Hoạt động</MenuItem>
                                </TextField> */}

                                <DialogActions>
                                    <Button onClick={handleDialogClose}>Hủy</Button>
                                    <Button type="submit" color="primary">
                                        {dialogType === 'edit' ? 'Lưu' : 'Thêm'}
                                    </Button>
                                </DialogActions>
                            </form>
                        </DialogContent>
                    </>
                ) : (
                    <>
                        <DialogTitle>Xác Nhận Xóa Khách Hàng</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Bạn có chắc chắn muốn xóa khách hàng này không?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Hủy</Button>
                            <Button onClick={handleDelete} color="error">
                                Xóa
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default ManageCustomerTable;
