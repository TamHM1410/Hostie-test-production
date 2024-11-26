"use client"

import { Button, Box, Container } from "@mui/material"
import { useState } from "react"
import ForumTypeFilter from "./ForumTypeFilter"
import ForumTypeInFormation from "./ForumTypeInFormation"
import BookingDashboard from "./Booking"
import { useSettingsContext } from "src/components/settings"


const ForumTypeView = () => {
    const [view, setView] = useState(false)
    const showSearch = () => {
        setView(!view)
    }
    const settings = useSettingsContext();
    const year = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return (

        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Box
                display="flex"
                flexDirection="column"

            >
                <Box display="flex" justifyContent="end" mb={2} width="100%">
                    <Button
                        variant="contained"
                        onClick={showSearch}
                        sx={{
                            background: "linear-gradient(to right, #2152FF, #21D4FD)",
                            fontWeight: 'medium',
                            fontSize: '0.875rem',
                            px: 5,
                            mt: 2,
                        }}
                    >
                        Tìm kiếm Nâng Cao
                    </Button>
                </Box>
                <ForumTypeFilter searchVisible={view} month={currentMonth} year={year} setClose={setView} />
                <ForumTypeInFormation />
                <BookingDashboard year={year} month={currentMonth} />
            </Box>

        </Container>


    )
}

export default ForumTypeView
