import React from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';

const ColorNotes = () => {
  const colorList = [
    { name: "Đã đặt phòng", color: "#BFF2FD" },
    { name: "Giữ chỗ", color: "#FFD4709E" },
    { name: "Vô hiệu hóa", color: "#DEFFE1" },
    { name: "Còn trống", color: "#FFFFFF" },
    { name: "Đang chờ xác nhận đặt", color: "#db8282" },
    { name: "Đang chờ xác nhận giữ", color: "#f3e7cb" }
  ];

  return (
    <Box sx={{ p: 2, display:"flex", flexDirection:"row" }}>
      <Grid container spacing={2}>
        {colorList.map((color, index) => (
          <Grid item xs={6} sm={4} key={index}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 1
            }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: color.color, 
                  border: '1px solid #000', 
                  borderRadius: "50%",
                  flexShrink: 0
                }} 
              />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {color.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      
        <Typography sx={{width:"16%"}} variant="body2" color="text.secondary">
          K = 1,000VND
        </Typography>
    </Box>
  );
};

export default ColorNotes;