"use client"

import { Button, Box, Container } from "@mui/material"
import { useState } from "react"
import ForumTypeFilter from "./ForumTypeFilter"
import ForumTypeInFormation from "./ForumTypeInFormation"
import BookingDashboard from "./Booking"
import { useSettingsContext } from "src/components/settings"
import ColorNotes from "./ColorNote"


//  @store 
import { useCurrentDate } from "src/zustand/pickDate"


const ForumTypeView = () => {
    const {month}=useCurrentDate()
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
              
                <ForumTypeInFormation />


                <Box display="flex" justifyContent="space-between" mb={2} width="100%">
                    <ColorNotes />
                    <Box textAlign='center'>
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
                </Box>

                <ForumTypeFilter setMonth={setMonths} setYears={setYears} searchVisible={view} month={months} year={years} setClose={setView} />

                <BookingDashboard year={years} setYears={setYears} selectedMonth={month} setSelectedMonth={setMonths} />

            </Box>

        </Container>


    )
}

export default ForumTypeView
