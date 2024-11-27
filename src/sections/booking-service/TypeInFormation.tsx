
import { FireTruckOutlined, HomeOutlined, LinkOutlined, PhoneOutlined, VerifiedUserOutlined } from "@mui/icons-material";
import { Divider, Typography, Link as MUILink, Box, Grid } from "@mui/material";

export default function TypeInFormation({ data }: any) {
    return (
        <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {data?.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
                <MUILink href="/" variant="body1" underline="hover">
                    {data?.phoneNumber} <PhoneOutlined style={{ color: '#2152FF' }} />
                </MUILink>
                <Divider orientation="vertical" flexItem />
                <MUILink href="/" variant="body1" underline="hover">
                    Google Drive <LinkOutlined style={{ color: '#2152FF' }} />
                </MUILink>
                <Divider orientation="vertical" flexItem />
                <MUILink href="/" variant="body1" underline="hover">
                    Zalo <LinkOutlined style={{ color: '#2152FF' }} />
                </MUILink>
            </Box>
            <Typography variant="body1" mt={2}>
                <MUILink href="/" underline="hover">
                    {data?.address?.address} <LinkOutlined style={{ color: '#2152FF' }} />
                </MUILink>
            </Typography>
            <Grid container spacing={2} mt={2}>
                <Grid item>
                    <Typography variant="body1">
                        <HomeOutlined style={{ color: '#2152FF' }} /> {data?.num_of_bedrooms} phòng ngủ
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1">
                        <FireTruckOutlined style={{ color: '#2152FF' }} /> Karaoke
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1">
                        <FireTruckOutlined style={{ color: '#2152FF' }} /> Hồ bơi
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1">
                        <VerifiedUserOutlined style={{ color: '#2152FF' }} /> Tiêu chuẩn: {data?.max_guests} người
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}


