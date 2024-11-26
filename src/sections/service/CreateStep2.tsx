import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Chip, Divider, DialogActions } from '@mui/material';
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
    amenity_id: string;
    description: string;
}

interface IconOption {
    id: string;
    icon: string;
    name: string;
}

interface Step2Props {
    selectedAmenities: Amenity[];
    setSelectedAmenities: (amenities: Amenity[]) => void;
    previousStep: () => void;
    currentStep: number;
    onSubmit: (amenities: Amenity[]) => void;
}

export default function Step2({
    selectedAmenities,
    setSelectedAmenities,
    previousStep,
    currentStep,
    onSubmit,
}: Step2Props |any) {
    const [icons, setIcons] = useState<IconOption[]>([]);
    const [amenityName, setAmenityName] = useState<string>('');
    const [selectedIcon, setSelectedIcon] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadIcons = async () => {
            const data = await fetchIcon();
            setIcons(data);
        };
        loadIcons();
    }, []);

    const handleAddAmenity = () => {
        if (!amenityName || !selectedIcon) {
            setError('Vui lòng nhập tên tiện ích và chọn 1 biểu tượng');
            return;
        }

        if (selectedAmenities.length >= 4) {
            setError('Bạn chỉ có thể thêm tối đa 4 tiện ích.');
            return;
        }

        const newAmenity: Amenity = { name: amenityName, amenity_id: selectedIcon, description };
        setSelectedAmenities([...selectedAmenities, newAmenity]);

        // Reset form fields
        setAmenityName('');
        setSelectedIcon('');
        setDescription('');
        setError('');
    };

    const handleRemoveAmenity = (amenityToRemove: Amenity) => {
        setSelectedAmenities(selectedAmenities.filter((a:any) => a.name !== amenityToRemove.name));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedAmenities.length === 0) {
            setError('Vui lòng thêm ít nhất một tiện ích');
            return;
        }

        onSubmit(selectedAmenities);
    };

    return (
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Typography variant='h6'>Thêm tiện ích cho lưu trú</Typography>
            <Box display="flex" flexDirection="column" gap={2} alignItems="center" mt={2}>
                <TextField
                    id="outlined-amenity-name"
                    label="Tên tiện ích"
                    value={amenityName}
                    onChange={(e) => setAmenityName(e.target.value)}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: { xs: '100%', sm: 450 } }}
                    error={Boolean(error && !amenityName)}
                    helperText={error && !amenityName ? 'Tên tiện ích không được để trống' : ''}
                />
                <TextField
                    id="outlined-select-amenity_id"
                    select
                    label="Chọn biểu tượng"
                    value={selectedIcon}
                    onChange={(e) => setSelectedIcon(e.target.value)}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: { xs: '100%', sm: 450 } }}
                    error={Boolean(error && !selectedIcon)}
                    helperText={error && !selectedIcon ? 'Vui lòng chọn biểu tượng' : ''}
                >
                    {icons.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            <img src={option.icon} alt={option.name} width={20} style={{ marginRight: 8 }} />
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="outlined-description"
                    label="Mô tả tiện ích"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    fullWidth
                    sx={{ minWidth: { xs: '100%', sm: 450 } }}
                />
                <Button onClick={handleAddAmenity} color="primary" size='small' variant='outlined'>
                    Thêm tiện ích
                </Button>

                {error && (
                    <Typography color="error" variant="body2" mt={1}>
                        {error}
                    </Typography>
                )}
            </Box>
            <Divider sx={{ marginBottom: 3, marginTop: 3 }} />
            <Box mt={2}>
                <Typography variant="subtitle1">Tiện ích đã thêm:</Typography>
                <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                    {selectedAmenities.length > 0 ? (
                        selectedAmenities.map((amenity:any, index:any) => (
                            <Chip
                                key={index}
                                label={`${amenity.name} `}
                                onDelete={() => handleRemoveAmenity(amenity)}
                                color="primary"
                            />
                        ))
                    ) : (
                        <Typography variant="body2">Chưa có tiện ích nào được thêm</Typography>
                    )}
                </Box>
            </Box>
            <Box mt={4}>
                <Typography variant="subtitle1">Biểu tượng đã chọn:</Typography>
                <Box mt={1} display="flex" gap={3} flexWrap="wrap">
                    {selectedAmenities.length > 0 ? (
                        selectedAmenities.map((amenity:any, index:any) => (
                            <Typography key={index} sx={{ textAlign: 'center' }}>
                                <img src={icons.find(a => a.id === amenity.amenity_id)?.icon || ''} alt={amenity.name} />
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2">Không có biểu tượng nào</Typography>
                    )}
                </Box>
            </Box>
            <Divider sx={{ marginTop: 3 }} />
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={previousStep} disabled={currentStep === 0}>
                    Trở lại
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={selectedAmenities.length === 0}
                >
                    Tiếp theo
                </Button>
            </DialogActions>
        </Box>
    );
}
