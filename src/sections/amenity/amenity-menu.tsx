import { Box, Button, Chip, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import DeleteRoleModal from './role-delete-modal';
// import EditRoleModal from './role-edit-modal';
import DeleteAmentityModal from './delete-modal';
import EditAmenityModal from './edit-modal';
import ViewDetailModal from './view-detail-modal';
const AmenityMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setEditModal] = useState<boolean>(false);

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
            <ViewDetailModal />
          </MenuItem>
          <MenuItem sx={{ gap: 2 }}>
            <EditAmenityModal />
          </MenuItem>
          <MenuItem sx={{ gap: 2 }}>
            <DeleteAmentityModal />
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default AmenityMenu;
