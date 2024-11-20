import { useState } from 'react';

import TuneIcon from '@mui/icons-material/Tune';
import { Button, Menu, MenuItem, Box } from '@mui/material';

const ButlerFilter = ({ filter, setFilter }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <Box >
      <Button
        id="basic-button "
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ gap: 2 }}
      >
        <TuneIcon /> Bộ lọc
      </Button>
      <Menu
        id="basic-menu"
        aria-labelledby="basic-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
           <MenuItem sx={{ gap: 2 }} >
           <TuneIcon />    

        </MenuItem>
        <MenuItem sx={{ gap: 2 }} onClick={() => setFilter('all')}>
        Danh sách quản gia
        </MenuItem>
        <MenuItem sx={{ gap: 2 }} onClick={() => setFilter('accepted')}>
        Danh sách cần duyệt
        </MenuItem>
    
      </Menu>
    </Box>
  );
};

export default ButlerFilter;
