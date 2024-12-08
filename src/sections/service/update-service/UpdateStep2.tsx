import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Chip, Divider, DialogActions, CircularProgress, Backdrop } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

const API_BASE_URL = 'https://core-api.thehostie.com/amenities/icon';

export const fetchIcon = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching icons:', error);
        return [];
    }
};

interface Amenity {
    name: string;
    icon_id: string;
    description: string;
    icon?: string;
}

interface IconOption {
    id: string;
    icon: string;
    name: string;
}

interface Step2Props {
    selectedAmenities: Amenity[];
    setSelectedAmenities: (amenities: Amenity[]) => void;
    onSubmit: (amenities: Amenity[]) => void;
}

export default function UpdateStep2({
    selectedAmenities,
    setSelectedAmenities,
    onSubmit,
}: Step2Props | any) {
    const [icons, setIcons] = useState<IconOption[]>([]);
    const [amenityName, setAmenityName] = useState<string>('');
    const [selectedIcon, setSelectedIcon] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Temporary amenities list for visual updates
    const [tempSelectedAmenities, setTempSelectedAmenities] = useState<Amenity[]>(selectedAmenities);

    useEffect(() => {
        const loadIcons = async () => {
            setIsLoading(true);
            const data = await fetchIcon();
            setIcons(data);
            setIsLoading(false);
        };
        loadIcons();
    }, []);

    const handleAddAmenity = () => {
        // Check if the maximum number of amenities has been reached
        if (tempSelectedAmenities.length >= 4) {
            setError('Bạn không thể thêm quá 4 tiện ích.');
            return;
        }

        // Check if the amenity name is already in the list
        if (tempSelectedAmenities.some(amenity => amenity.name === amenityName)) {
            setError('Tên tiện ích đã tồn tại.');
            return;
        }

        if (!amenityName || !selectedIcon) {
            setError('Vui lòng nhập tên tiện ích và chọn biểu tượng.');
            return;
        }

        const newAmenity: Amenity = { name: amenityName, icon_id: selectedIcon, description };
        setTempSelectedAmenities([...tempSelectedAmenities, newAmenity]);
        setAmenityName('');
        setSelectedIcon('');
        setDescription('');
        setError('');
    };

    const handleRemoveAmenity = (amenityToRemove: Amenity) => {
        setTempSelectedAmenities(tempSelectedAmenities.filter(a => a.name !== amenityToRemove.name));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (tempSelectedAmenities.length === 0) {
            setError('Vui lòng thêm ít nhất một tiện ích.');
            return;
        }

        // Update the real selectedAmenities only on submit
        setSelectedAmenities(tempSelectedAmenities);
        onSubmit(tempSelectedAmenities);
    };

    return (
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box display="flex" flexDirection="column" alignItems="center" >
                <TextField
                    label="Tên tiện ích"
                    value={amenityName}
                    onChange={(e) => setAmenityName(e.target.value)}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: { xs: '100%', sm: 450 } }}
                    error={Boolean(error && !amenityName)}
                    helperText={error && !amenityName ? 'Tên tiện ích không được để trống.' : ''}
                />
                <TextField
                    select
                    label="Chọn biểu tượng"
                    value={selectedIcon}
                    onChange={(e) => setSelectedIcon(e.target.value)}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: { xs: '100%', sm: 450 } }}
                    error={Boolean(error && !selectedIcon)}
                    helperText={error && !selectedIcon ? 'Vui lòng chọn biểu tượng.' : ''}
                >
                    {icons.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            <img src={option.icon} alt={option.name} width={20} style={{ marginRight: 8 }} />
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Mô tả tiện ích"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: { xs: '100%', sm: 450 } }}
                />

                <Button onClick={handleAddAmenity} color="primary" size="small">
                    Thêm tiện ích
                </Button>

                {error && (
                    <Typography color="error" variant="body2" mt={1}>
                        {error}
                    </Typography>
                )}
            </Box>

            <Box mt={2}>
                <Typography variant="subtitle1">Tiện ích đã thêm:</Typography>
                <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                    {tempSelectedAmenities.length > 0 ? (
                        tempSelectedAmenities.map((amenity, index) => (
                            <Chip
                                key={index}
                                label={`${amenity.name} (icon ${icons.find(a => a.id === amenity.icon_id)?.name || ''})`}
                                onDelete={() => handleRemoveAmenity(amenity)}
                                color="primary"
                            />
                        ))
                    ) : (
                        <Typography variant="body2">Chưa có tiện ích nào được thêm.</Typography>
                    )}
                </Box>
            </Box>
            <Box mt={2}>
                <Typography variant="subtitle1">Biểu tượng đã chọn:</Typography>
                <Box mt={1} display="flex" gap={3} flexWrap="wrap">
                    {tempSelectedAmenities.length > 0 ? (
                        tempSelectedAmenities.map((amenity, index) => (
                            <Typography key={index} sx={{ textAlign: 'center' }}>
                                <img src={icons.find(a => a.id === amenity.icon_id)?.icon || ''} alt={amenity.name} />
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2">Không có biểu tượng nào</Typography>
                    )}
                </Box>
            </Box>
            <Divider sx={{ marginTop: 3 }} />
            <DialogActions>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={tempSelectedAmenities.length === 0}
                >
                    Cập nhật
                </Button>
            </DialogActions>
        </Box>
    );
}
