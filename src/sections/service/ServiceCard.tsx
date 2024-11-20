/* eslint-disable radix */
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useDropzone, Accept } from 'react-dropzone';
import {
    Pagination,
    Typography as IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    Tabs,
    Tab,
    Box,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosClient from 'src/utils/axiosClient';
import UpdateStep0 from './update-service/UpdateStep0';
import UpdateStep1 from './update-service/UpdateStep1';
import UpdateStep2 from './update-service/UpdateStep2';
import UpdateStep5 from './update-service/UpdateStep5';

const baseURL = 'http://34.81.244.146:5005';

interface Service {
    residence_id: number;
    residence_name: string;
    residence_type: string;
    images: { image: string }[];
}
interface ServiceCardListProps {
    currentItems: Service[];
    totalPages: number;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
    fetchData: any;
}
export default function ServiceCardList({
    currentItems,
    totalPages,
    currentPage,
    onPageChange,
    fetchData,
}: ServiceCardListProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // delete state
    const [selectedId, setSelectedId] = React.useState<number | null>(null);
    const [selectedName, setSelectedName] = React.useState<string>('');
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [confirmName, setConfirmName] = React.useState<string>('');
    // edit state
    const [openEditDialog, setOpenEditDialog] = React.useState<boolean>(false);
    const search = '';
    const [activeStep, setActiveStep] = React.useState<number>(0);
    const [residenceData, setResidenceData] = React.useState<any>(null);
    // icon state
    const [selectedAmenities, setSelectedAmenities] = React.useState([]);
    const handleClick = (event: React.MouseEvent<HTMLElement>, id: number, name: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
        setSelectedName(name);
    };
    // Image state
    const [images, setImages] = React.useState<File[]>([]);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        setImages((prevImages) => [...prevImages, ...acceptedFiles]);
        setSnackbarOpen(true);
    }, []);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*' as unknown as Accept,
    });
    // Delete residence
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
        setSelectedName('');
    };
    const handleDeleteClick = () => {
        setOpenDialog(true);
        setAnchorEl(null);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
        setConfirmName('');
    };
    const handleDeleteConfirm = async () => {
        if (confirmName === selectedName) {
            try {
                const response = await axiosClient.delete(`${baseURL}/residences/`, {
                    data: { id: selectedId }, // Use `data` for the body in Axios
                });

                // Check if the response is successful
                if (response.status === 200) {
                    toast.success('Xóa lưu trú thành công!');
                    fetchData(currentPage, search);
                } else {
                    console.error('Lỗi khi xóa:', response.data);
                    toast.error('Lỗi khi xóa lưu trú.');
                }
            } catch (error) {
                console.error('Lỗi khi xóa:', error);
                toast.error('Lỗi khi xóa lưu trú.');
            } finally {
                setOpenDialog(false);
                setConfirmName('');
            }
        } else {
            toast.error('Tên không chính xác, không thể xóa.');
        }
    };
    // Edit dialog
    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setActiveStep(0);
        setSelectedAmenities([]);
        setImages([]);
    };
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveStep(newValue);
    };
    // data residence

    const fetchDataDetail = async () => {
        try {
            const response = await axiosClient.get(`${baseURL}/residences/${selectedId}`, {});
            setResidenceData(response.data.data);
            setSelectedAmenities(response.data.data.amenities);
        } catch (error) {
            console.error('Error fetching residence data:', error);
            toast.error('Lỗi khi lấy thông tin lưu trú.');
        }
    };
    // image data of residence
    const fetchImages = async () => {
        try {
            const response = await axiosClient.get(`${baseURL}/residences/${selectedId}/images`, {
                params: {
                    page_size: 99,
                    last_id: 0,
                },
            });

            const data = response.data;
            if (data.success) {
                const fetchedImages = data.data.images.map((image: { image: string }) => image.image);
                setImages(fetchedImages);
            } else {
                console.error(data.msg);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };
    const handleEditClick = () => {
        setOpenEditDialog(true);
        setAnchorEl(null);
        fetchDataDetail();
        fetchImages();
    };

    // submit step
    const handleStep1Submit = async (data: any) => {
        const payload = {
            step: 1,
            name: data.serviceName,
            id: residenceData.residence_id,
            num_bath_room: data.bathrooms,
            num_bed_room: data.bedrooms,
            num_of_beds: data.capacity,
            max_guests: data.capacity,
            type: parseInt(data.serviceType),
        };

        try {
            const response = await axios.post(`${baseURL}/residences`, payload, {
                headers: {
                    Authorization:
                        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob3N0IiwidXNlcl9pZCI6Mywic2NvcGUiOiJST0xFX1VTRVIiLCJpc3MiOiJob3N0aWUuc2l0ZSIsImV4cCI6MTc2MDQwNjg4MCwiaWF0IjoxNzI4ODcwODgwLCJqdGkiOiI1MjVlZjFkZi03YzU2LTQ4MWUtYTY1My0yNDIwMGEyNDY1ZDMiLCJlbWFpbCI6Imhvc3RAZXhhbXBsZS5jb20ifQ.ClnTV7UjufJg8d2QeJi71RNfVgayqcj6GhRNR9kVladynkm2k36Qr_pATDa3u0w1EHU2DlNaMLK8y-T9Huewvw',
                },
            });
            toast.success('Cập nhật thông tin cơ bản của lưu trú thành công');
            fetchDataDetail();
        } catch (error) {
            console.error('Error submitting step 1:', error);
            toast.error('Đã xảy ra lỗi khi cập hãy kiểm tra lại dữ liệu.');
        }
    };
    const handleStep2Submit = async (data: any) => {
        const payload = {
            step: 2,
            id: residenceData.residence_id,
            province_code: data.province,
            district_code: data.district,
            ward_code: data.ward,
            address: data.address,
            phones: [data.phones],
        };
        try {
            const response = await axiosClient.post(`${baseURL}/residences`, payload, {});
            fetchDataDetail();
            toast.success('Cập nhật địa chỉ của lưu trú thành công');
        } catch (error) {
            console.error('Error submitting step 1:', error);
            toast.error('Đã xảy ra lỗi khi cập hãy kiểm tra lại dữ liệu.');
        }
    };
    const handleStep3Submit = async (data: any) => {
        const payload = {
            step: 3,
            id: residenceData.residence_id,
            // Map to extract amenity_id, name, and description from each selected amenity
            amenities: data.map((amenity: { icon_id: number; name: string; description: string }) => ({
                amenity_id: amenity.icon_id,
                name: amenity.name,
                description: amenity.description,
            })),
        };
        try {
            const response = await axiosClient.post(`${baseURL}/residences`, payload, {});
            fetchDataDetail();
            toast.success('Cập nhật tiện ích của lưu trú thành công');
        } catch (error) {
            console.error('Error submitting step 1:', error);
            toast.error('Đã xảy ra lỗi khi cập hãy kiểm tra lại dữ liệu.');
        }
    };
    const handleStep5Submit = async (data: any) => {
        const formData = new FormData();
        formData.append('step', '5');
        formData.append('id', residenceData.residence_id);
        images.forEach((file) => {
            formData.append('files', file);
        });
        if (images.length > 6) {
            toast.error('Bạn chỉ có thể đăng tối đa 6 bức hình');
            return;
        }
        try {
            const response = await axiosClient.post(`${baseURL}/residences`, formData, {});
            fetchImages();
            toast.success('Cập nhật hình ảnh của lưu trú thành công');
        } catch (error) {
            console.error('Error submitting step 4:', error);
            toast.error('Đã xảy ra lỗi khi cập hãy kiểm tra lại dữ liệu.');
        }
    };
    return (
        <>
            <Grid container spacing={3}>
                {currentItems.map((data, index) => (
                    <Grid
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        display="flex"
                        justifyContent="center"
                        component="div"
                    >
                        <Card
                            sx={{
                                maxWidth: 300,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                            }}
                        >
                            {data.images.length > 0 ? (
                                <CardMedia
                                    sx={{ height: 200, objectFit: 'cover' }}
                                    image={data.images[0].image}
                                    title={data.residence_name}
                                />
                            ) : (
                                <CardMedia
                                    sx={{ height: 200, objectFit: 'cover' }}
                                    image="https://png.pngtree.com/png-vector/20221108/ourmid/pngtree-cartoon-house-illustration-png-image_6434928.png"
                                    title="No image available"
                                />
                            )}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {data.residence_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Loại lưu trú: {data.residence_type}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        aria-controls="menu"
                                        onClick={(event) => handleClick(event, data.residence_id, data.residence_name)}
                                    >
                                        <MoreHorizIcon />
                                    </IconButton>
                                    <Menu
                                        id="menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        sx={{
                                            '& .MuiPaper-root': {
                                                backgroundColor: 'transparent',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        <Link
                                            href={`/dashboard/service/detail/${selectedId}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <InfoIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary="Xem chi tiết lưu trú" />
                                            </MenuItem>
                                        </Link>
                                        <MenuItem onClick={handleEditClick}>
                                            <ListItemIcon>
                                                <EditIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Sửa lưu trú" />
                                        </MenuItem>
                                        <MenuItem onClick={handleDeleteClick}>
                                            <ListItemIcon>
                                                <DeleteIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Xóa lưu trú" />
                                        </MenuItem>
                                    </Menu>
                                </CardActions>
                            </div>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={onPageChange}
                    sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}
                />
            )}
            <Dialog open={openEditDialog} onClose={handleEditDialogClose} fullWidth maxWidth="md">
                <DialogTitle>Sửa lưu trú</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        <Tabs
                            value={activeStep}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ marginBottom: 3 }}
                        >
                            <Tab label=" Thông tin lưu trú" />
                            <Tab label=" Địa chỉ lưu trú" />
                            <Tab label=" Tiện ích lưu trú" />
                            <Tab label=" Giá nơi lưu trú" />
                            <Tab label=" Hình ảnh lưu trú" />
                        </Tabs>

                        {/* Conditional rendering for active step */}
                        {activeStep === 0 && residenceData && (
                            <UpdateStep0
                                onSubmit={handleStep1Submit}
                                initialValues={{
                                    serviceName: residenceData.residence_name,
                                    serviceType: residenceData.residence_type_id,
                                    email: residenceData.residence_email,
                                    website: residenceData.residence_website,
                                    bedrooms: residenceData.num_of_bedrooms,
                                    bathrooms: residenceData.num_of_bathrooms,
                                    capacity: residenceData.max_guests,
                                    description: residenceData.residence_description,
                                }}
                            />
                        )}

                        {activeStep === 1 && (
                            <UpdateStep1
                                initialValues={{
                                    province: residenceData.province_code,
                                    district: residenceData.district_code,
                                    ward: residenceData.ward_code,
                                    address: residenceData.residence_address,
                                    phones: residenceData.phones[0]?.phone,
                                }}
                                onSubmit={handleStep2Submit}
                            />
                        )}
                        {activeStep === 2 && (
                            <UpdateStep2
                                onSubmit={handleStep3Submit}
                                setSelectedAmenities={setSelectedAmenities}
                                selectedAmenities={selectedAmenities}
                            />
                        )}
                        {activeStep === 3 && <div>Form for Step 4</div>}
                        {activeStep === 4 && (
                            <UpdateStep5
                                onSubmit={handleStep5Submit}
                                images={images}
                                setImages={setImages}
                                snackbarOpen={snackbarOpen}
                                setSnackbarOpen={setSnackbarOpen}
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                            />
                        )}
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose} sx={{ minHeight: 400 }}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ marginBottom: 3 }}>
                        {`Nhập lại tên của lưu trú "${selectedName}" để xác nhận xóa.`}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên lưu trú"
                        fullWidth
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Hủy</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        disabled={confirmName !== selectedName || confirmName === ''} // Disable if the name doesn't match or input is empty
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
