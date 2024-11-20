import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';

import logoMain from 'public/logo/hostie.png';

// ----------------------------------------------------------------------
import Image from 'next/image';
import { Typography } from '@mui/material';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        <Image priority src={logoMain} height={150} width={150} alt="Follow us onXXX" />
        {/* <Typography variant='h3' sx={{px:2}}>Hostie</Typography> */}
        
      </Link>
    );
  }
);

export default Logo;
