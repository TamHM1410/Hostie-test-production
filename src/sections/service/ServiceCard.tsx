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
    Chip,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { MenuIcon } from 'lucide-react';
import axiosClient from 'src/utils/axiosClient';
import UpdateStep0 from './update-service/UpdateStep0';
import UpdateStep1 from './update-service/UpdateStep1';
import UpdateStep2 from './update-service/UpdateStep2';
import UpdateStep5 from './update-service/UpdateStep5';
import UpdateStep4 from './update-service/UpdateStep4';
import { formatDate } from 'src/utils/format-time';
import UpdatePolicy from './update-service/UpdateStep3';

const baseURL = 'https://core-api.thehostie.com';

const policyTemplate = `
🏨 Chính Sách Khách Sạn Paradise

⏰ Thời gian nhận phòng và trả phòng
- Nhận phòng: sau 14:00
- Trả phòng: trước 12:00
`;

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
    isLoading: any;
    setIsLoading: any;
}
export default function ServiceCardList({
    currentItems,
    totalPages,
    currentPage,
    onPageChange,
    fetchData,
    setIsLoading
}: ServiceCardListProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [prices, setPrices] = React.useState()
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
        fetchData(currentPage, search);
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
        setIsLoading(true)
        if (confirmName === selectedName) {
            try {
                const response = await axiosClient.delete(`${baseURL}/residences`, {
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
                setIsLoading(false)
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
            setResidenceData(response.data);
            setSelectedAmenities(response.data.amenities);
        } catch (error) {
            console.error('Error fetching residence data:', error);
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
            setImages(response?.data?.images)
            
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };
    const fetchPrices = async () => {
        try {
            const response = await axiosClient.get(`${baseURL}/residences/${selectedId}/prices`, {});
            setPrices(response.data)
        } catch (error) {
            console.error('Error fetching residence data:', error);
        }
    };

    const [policy, setPolicy] = React.useState()

    const fetchPolicy = async () => {
        try {
            const response = await axiosClient.get(`${baseURL}/residences/${selectedId}/policy`, {});
            setPolicy(response.data.files)
        } catch (error) {
            console.error('Error fetching residence data:', error);
        }
    };
    const handleEditClick = () => {
        setOpenEditDialog(true);
        setAnchorEl(null);
        fetchDataDetail();
        fetchPrices();
        fetchImages();
        fetchPolicy()
    };
    // submit step
    const handleStep1Submit = async (data: any) => {
        setIsLoading(true)
        const payload = {
            step: 1,
            name: data.serviceName,
            id: residenceData.residence_id,
            num_bath_room: data.bathrooms,
            num_bed_room: data.bedrooms,
            num_of_beds: data.numOfBeds,
            max_guests: data.capacity,
            standard_num_guests: data.capacityStander,
            residence_description: data.description,
            extra_guest_fee: data.surcharge,
            type: parseInt(data.serviceType),
        };

        try {
            const response = await axiosClient.post(`${baseURL}/residences`, payload);
            toast.success('Cập nhật thông tin cơ bản của lưu trú thành công');
            fetchDataDetail();
            setIsLoading(false)
        } catch (error) {
            console.error('Error submitting step 1:', error);
            toast.error('Đã xảy ra lỗi khi cập hãy kiểm tra lại dữ liệu.');
            setIsLoading(false)
        }
    };
    const handleStep2Submit = async (data: any) => {
        setIsLoading(true)
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
            setIsLoading(false)
        } catch (error) {
            console.error('Error submitting step 1:', error);
            toast.error('Đã xảy ra lỗi khi cập hãy kiểm tra lại dữ liệu.');
            setIsLoading(false)
        }
    };

    const handleStep3Submit = async (data: any) => {
        setIsLoading(true)
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
            setIsLoading(false)
        } catch (error) {
            console.error('Error submitting step 1:', error);
            toast.error('Đã xảy ra lỗi khi cập hãy kiểm tra lại dữ liệu.');
            setIsLoading(false)
        }
    };
    const handleStep4Submit = async (data: any) => {
        setIsLoading(true)
        const payload = {
            step: 4,
            id: parseInt(residenceData.residence_id),
            price_default: data.default_price,
            price_weekend: data.weekend_price.map((entry: any) => ({
                day: entry.weeknd_day, // Assuming weekendFee represents the day or type of weekend
                price: parseFloat(entry.price),
            })),
            price_special: [
                {
                    date: '20-10-2024', // Assuming this is the holiday date
                    price: 43,
                },
            ],
            price_season: data.season_price.map((entry: any) => ({
                start_date: formatDate(entry.start_date), // Adjusted to use entry data
                end_date: formatDate(entry.end_date), // Adjusted to use entry data
                price: parseFloat(entry.price),
            })),
        };

        try {
            const response = await axiosClient.post('https://core-api.thehostie.com/residences', payload, {

            });
            toast.success("Cập nhật giá thành công")
            fetchPrices()
            setIsLoading(false)
        } catch (error) {
            console.error('Error submitting step 3:', error);
            toast.error('Cập nhật giá thất bại vui lòng thử lại sau.')
            setIsLoading(false)
        }
    };


    const [imageDelete, setImageDelete] = React.useState()

    const handleStep5Submit = async (data: any) => {
        setIsLoading(true)
        const formData = new FormData();
        formData.append('step', '5');
        formData.append('id', residenceData.residence_id);
        images.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('delete_images', imageDelete)
        try {
            const response = await axiosClient.post('https://core-api.thehostie.com/residences', formData, {

            });
            handleClose();
            fetchImages()
            toast.success('Cập nhật hình ảnh nơi lưu trú thành công');
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            if (error.status === 413) {
                toast.error('Tệp hình quá nặng không thể upload lên server')
                setIsLoading(false)

            } else {
                setIsLoading(false)
                toast.error('Đã có lỗi xảy ra')
            }

        }
    };
    const [deletePolicy, setDeletePolicy] = React.useState()

    const handleSavePolicy = async (files: File[]) => {
        setIsLoading(true)
        const formData = new FormData();
        formData.append('policy', policyTemplate);
        formData.append('residence_id', residenceData.residence_id);
        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('delete_policy', deletePolicy)
        try {
            const response = await axiosClient.post('https://core-api.thehostie.com/residences/policy', formData, {

            });
            fetchPolicy()
            toast.success('Cập nhật hình ảnh chính sách thành công')
            setIsLoading(false)
        } catch (error) {
            toast.error('Đã có lỗi khi cập nhật hình ảnh chính sách')
            setIsLoading(false)

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
                                    {data?.status === 1 && (
                                        <Chip
                                            label="Chưa hoàn thành"
                                            color="warning"
                                            sx={{ marginTop: 1 }}
                                        />
                                    )}
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
                                        {/* Xem chi tiết lưu trú: luôn hiển thị */}
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
                                        {/* { chin sach can ho} */}
                                      
                                     
                                        <Link
                                            href={`/dashboard/service/manage-block-residences/${selectedId}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <MenuIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary="Quản lí khóa nơi lưu trú" />
                                            </MenuItem>
                                        </Link>



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
                            <Tab label=" Chính sách nơi lưu trú" />
                            <Tab label=" Hình ảnh lưu trú" />
                        </Tabs>

                        {/* Conditional rendering for active step */}
                        {activeStep === 0 && residenceData && (
                            <UpdateStep0
                                onSubmit={handleStep1Submit}
                                initialValues={{
                                    serviceName: residenceData.residence_name,
                                    serviceType: residenceData.residence_type_id,
                                    bedrooms: residenceData.num_of_bedrooms,
                                    bathrooms: residenceData.num_of_bathrooms,
                                    capacity: residenceData.max_guests,
                                    description: residenceData.residence_description,
                                    surcharge: residenceData.extra_guest_fee,
                                    capacityStander: residenceData.standard_num_guests,
                                    numOfBeds: residenceData.num_of_beds
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
                        {activeStep === 3 && (<UpdateStep4 onSubmit={handleStep4Submit} dataPrices={prices} />)}
                        {activeStep === 4 && (<UpdatePolicy dataFiles={policy} onSave={handleSavePolicy} setDeletePolicy={setDeletePolicy} />)}
                        {activeStep === 5 && (
                            <UpdateStep5
                                onSubmit={handleStep5Submit}
                                images={images}
                                setImages={setImages}
                                snackbarOpen={snackbarOpen}
                                setSnackbarOpen={setSnackbarOpen}
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                setImageDelete={setImageDelete}
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
