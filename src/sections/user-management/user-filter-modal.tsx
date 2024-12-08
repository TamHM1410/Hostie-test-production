import { useState } from 'react';

import TuneIcon from '@mui/icons-material/Tune';
import { Button, Menu, MenuItem, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const UserFilter = ({ filter, setFilter, value, setValue }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [showClearIcon, setShowClearIcon] = useState('none');

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowClearIcon(event.target.value === '' ? 'none' : 'flex');
    setValue(event.target.value);
  };

  const handleClearClick = (): void => {
    // TODO: Clear the search input
    setValue('');
    console.log('clicked the clear icon...');
  };

  return (
    <Box sx={{ ml: 5, display: 'flex', gap: 2 }}>
      <Box>
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
          <MenuItem sx={{ gap: 2 }}>
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
          {/* <MenuItem sx={{ gap: 2 }} onClick={() => setFilter('reject')}>
            Tài khoản đã từ chối
          </MenuItem> */}
        </Menu>
      </Box>
      <Box>
        <TextField
          size="small"
          variant="outlined"
          onChange={handleChange}
          value={value}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                style={{ display: showClearIcon }}
                onClick={handleClearClick}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <ClearIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default UserFilter;
