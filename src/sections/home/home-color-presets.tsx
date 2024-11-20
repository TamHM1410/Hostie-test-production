import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
// components
import { primaryPresets } from 'src/theme/options/presets';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function HomeColorPresets() {
  const settings = useSettingsContext();

  const options = primaryPresets.map((color) => ({
    name: color.name,
    value: color.main,
  }));

  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
     

      <m.div variants={varFade().inDown}>
        <Typography variant="h2">  Giao diện thân thiện & Dễ dàng sử dụng </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary' }}>
        Xử lí công việc của riêng bạn chỉ bằng một cú nhấp chuột
        </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ position: 'relative' }}>
      <Image disabledEffect alt="grid" src="/assets/images/home/presets/grid.webp" />

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inUp}>
          <Image
            disabledEffect
            alt="screen"
            src={`/assets/images/home/presets/screen_${settings.themeColorPresets}.webp`}
          />
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="sidebar"
              src={`/assets/images/home/presets/block_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [-5, 10, -5] }} transition={{ duration: 8, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="chart"
              src={`/assets/images/home/presets/chart_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>

      <Box sx={{ position: 'absolute', top: 0 }}>
        <m.div variants={varFade().inDown}>
          <m.div animate={{ y: [-25, 5, -25] }} transition={{ duration: 10, repeat: Infinity }}>
            <Image
              disabledEffect
              alt="sidebar"
              src={`/assets/images/home/presets/sidebar_${settings.themeColorPresets}.webp`}
            />
          </m.div>
        </m.div>
      </Box>
    </Box>
  );


  return (
    <Container
      component={MotionViewport}
      sx={{
        position: 'relative',
        py: { xs: 10, md: 15 },
      }}
    >
      {renderDescription}

      {/* {renderOptions} */}

      {renderContent}
    </Container>
  );
}
