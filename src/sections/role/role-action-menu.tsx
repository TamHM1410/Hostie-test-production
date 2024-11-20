//@hook
import { useState } from 'react';


//@mui
import { Box, Button, Chip, Menu, MenuItem } from '@mui/material';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';

//@component
import DeleteRoleModal from './role-delete-modal';
import EditRoleModal from './role-edit-modal';
import ViewDetailRoleModal from './role-view-modal';

const RoleActionMenu = () => {

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
            <ViewDetailRoleModal />
          </MenuItem>
          <MenuItem sx={{ gap: 2 }}>
            <EditRoleModal />
          </MenuItem>
          <MenuItem sx={{ gap: 2 }}>
            <DeleteRoleModal />
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default RoleActionMenu;
