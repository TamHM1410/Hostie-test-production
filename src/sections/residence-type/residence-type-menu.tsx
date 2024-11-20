//hooks
import { useState } from 'react';

//@mui

import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import EditResidenceTypeModal from './residence-type-edit-modal';
import DeleteResidenceTypeModal from './residence-type-delete';

const ResidenceActionMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <DensityMediumIcon />
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
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
            <EditResidenceTypeModal />
          </MenuItem>
          <MenuItem sx={{ gap: 2 }}>
            <DeleteResidenceTypeModal />
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default ResidenceActionMenu;
