import { useState } from 'react';

import TuneIcon from '@mui/icons-material/Tune';
import { Button, Menu, MenuItem, Box ,TextField,InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useDebounce } from 'src/hooks/use-debounce';

const Filter = ({ filter, setFilter,value,setValue,handleSearch }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [showClearIcon, setShowClearIcon] = useState("none");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setValue(event.target.value)
  };

  const handleClick = (): void => {
    // TODO: Clear the search input
    setValue('')
  };


  return (
    <Box sx={{ ml: 5 }}>
     

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
                    onClick={handleClick}
                    sx={{
                      cursor:'pointer'
                    }}
                  >
                    <ClearIcon />
                  </InputAdornment>
                )
              }}
            />
    </Box>
  );
};

export default Filter;
