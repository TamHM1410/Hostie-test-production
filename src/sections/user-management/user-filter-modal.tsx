import { useState } from 'react';

import TuneIcon from '@mui/icons-material/Tune';
import { Button, Menu, MenuItem, Box } from '@mui/material';

const UserFilter = ({ filter, setFilter }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <Box sx={{ ml: 5 }}>
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
          Tất cả tài khoản
        </MenuItem>
        <MenuItem sx={{ gap: 2 }} onClick={() => setFilter('accepted')}>
          Tài khoản đã duyệt
        </MenuItem>
        <MenuItem sx={{ gap: 2 }} onClick={() => setFilter('pending')}>
          Tài khoản cần duyệt
        </MenuItem>
        <MenuItem sx={{ gap: 2 }} onClick={() => setFilter('reject')}>
          Tài khoản đã từ chối
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserFilter;
