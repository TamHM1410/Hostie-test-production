"use client"

import { Button, Box, Container } from "@mui/material"
import { useState } from "react"
import ForumTypeFilter from "./ForumTypeFilter"
import ForumTypeInFormation from "./ForumTypeInFormation"
import BookingDashboard from "./Booking"
import { useSettingsContext } from "src/components/settings"
import { log } from "console"
import ColorNotes from "./ColorNote"


const ForumTypeView = () => {
    const [view, setView] = useState(false)
    const showSearch = () => {
        setView(!view)
    }
    const settings = useSettingsContext();
    const year = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const current1 = String(currentMonth).padStart(0, 2)
    const [months, setMonths] = useState(current1)
    const [years, setYears] = useState(year)

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
                <ForumTypeFilter setMonth={setMonths} setYears={setYears} searchVisible={view} month={months} year={years} setClose={setView} />
                <ForumTypeInFormation />
                <ColorNotes />
                <BookingDashboard year={years} setYears={setYears} selectedMonth={months} setSelectedMonth={setMonths} />

            </Box>

        </Container>


    )
}

export default ForumTypeView
