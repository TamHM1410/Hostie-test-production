import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Grid, FormControl, Select, MenuItem, Tooltip ,Box} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
//  @util
import { formattedAmountCalender } from 'src/utils/format-time';

//  @asset
import './Booking.Module.css';
//  @store
import { useCurrentDate } from 'src/zustand/pickDate';

//  @component
import CustomCalendarPicker from './CustomCalenderPicker';

//  @zustand

import './Booking.Module.css';

const LoadingRow = ({ columnsCount }) => (
  <tr>
    <td className="villa-name">
      <div className="villa-name-cell" style={{ textAlign: 'center' }}>
        Loading...
      </div>
    </td>
    {Array(columnsCount)
      .fill(0)
      .map((_, index) => (
        <td key={index} className="day-cell">
          <div className="skeleton-loading"></div>
        </td>
      ))}
  </tr>
);

const DayCell = React.memo(
  ({ day, villa, handleCellClick, isCellSelected, bookingInfo, user_name }: any) => {
    const isHostAccepted = bookingInfo?.waiting_down_payment === true;
    const isBooked = bookingInfo?.is_booked === true;

    return (
      <td
        key={day.index + 'x'}
        className={`day-cell clickable ${isHostAccepted ? 'host-accepted' : ''} ${
          isBooked ? 'booked' : ''
        }`}
        style={{
          backgroundColor: bookingInfo?.background_color || 'inherit',
          borderStyle: 'dashed',
        }}
        onClick={(e) => {
          handleCellClick(
            villa.name,
            day.day,
            villa.id,
            e,
            bookingInfo?.disabled,
            bookingInfo?.hold_status,
            bookingInfo?.is_booked,
            day?.month,
            day.index
          );
        }}
        onContextMenu={(e) => handleCellClick(villa.name, day.day, villa.id, e)}
        // onDoubleClick={(e)=> handleCellClick(villa.name, day.day, villa.id, e)}
      >
        {isCellSelected(villa.name, day.index) && <div className="selected"></div>}
        <div
          className="corner-number"
          style={{ color: 'rgb(0 0 0)', fontWeight: 400, fontSize: 14 }}
        >
          {bookingInfo ? `${formattedAmountCalender(bookingInfo.price)}` : 'Trống'}
        </div>
        {bookingInfo?.start_point && (
          <div className="rectangle start-point">
            <img
              src={
                bookingInfo.avatar_seller ||
                'https://images.pexels.com/photos/825904/pexels-photo-825904.jpeg?cs=srgb&dl=pexels-olly-825904.jpg&fm=jpg'
              }
              alt="Avatar"
              className="avatar"
            />
          </div>
        )}
        {bookingInfo?.middle_point && (
          <div className="rectangle middle-point">
            {bookingInfo.seller_username?.length <= 3 && (
              <div className="seller-name">{bookingInfo.seller_username || 'Seller'}</div>
            )}
          </div>
        )}
        {bookingInfo?.end_point && (
          <div className="rectangle end-point">
            <div className="seller-name">
              {parseInt(user_name) === bookingInfo?.seller_id
                ? 'Bạn'
                : bookingInfo.seller_username || 'Seller'}
            </div>
          </div>
        )}
      </td>
    );
  }
);
export default function BookingTableCalendar({
  bookingData = [],
  daysInMonth = [],

  fetchResidenceInfor,
  fetchPolicy,
  handleCellClick,
  fetchImages,
  isCellSelected,
  user_name,
  year,
  mapUsersOnline,
  isLoading, // Loading state
  pageSize = 20, // Number of items per page
}: any) {
  const observerTarget = useRef(null);

  const loadingRef = useRef(false); // Add ref to track loading state

  const { updatePageSize, totalPage, currentPage } = useCurrentDate();

  const [loadingMore, setLoadingMore] = useState(false);

  const handleObserver = useCallback(
    (entries) => {
      if (totalPage !== currentPage) {
        const target = entries[0];
        if (target.isIntersecting && !loadingRef.current) {
          updatePageSize();
          setLoadingMore(true);
        }
      }
    },
    [totalPage, currentPage]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserver]);

  // useEffect(() => {
  //   loadingRef.current = isLoading;
  // }, [isLoading]);

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th
              className="sticky-header villa-name"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Grid
                container
                spacing={2}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <CustomCalendarPicker />
              </Grid>
            </th>
            {daysInMonth.map((day, index) => (
              <th
                key={index}
                className={`day-header ${
                  ['T7', 'CN', 'T6'].includes(day.dayOfWeek) ? 'weekend-header' : ''
                }`}
                style={{ textAlign: 'center' }}
              >
                <div>{day.dayOfWeek}</div>
                <div className="weekend-text">{day.day}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookingData.length === 0 && !isLoading ? (
            <tr>
              <td colSpan={daysInMonth.length + 1}>Không có dữ liệu</td>
            </tr>
          ) : (
            <>
              {bookingData?.map((villa) => (
                <tr key={villa.name}>
                  <td className="villa-name">
                    <div
                      className="villa-name-cell"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        fetchResidenceInfor(villa.id);
                        fetchPolicy(villa.id);
                        fetchImages(villa.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          fetchResidenceInfor(villa.id);
                        }
                      }}
                      style={{ color: 'rgb(76 84 90)', textAlign: 'start', minWidth: 300 ,display:'flex',gap:2}}
                    >
                      {mapUsersOnline.get(villa.host_id) ? 
                      <Box sx={{display:'flex',alignItems:'center'}}>
                         <Tooltip title="Chủ nhà hiện đang online">
                       <FiberManualRecordIcon color='success'/>
                     </Tooltip>
                      </Box>
                     : 
                     <Box sx={{display:'flex',alignItems:'center'}}><Tooltip title="Chủ nhà hiện đang offline">
                     <FiberManualRecordIcon color='disabled'/>
                   </Tooltip></Box>

                     }
                      {villa.name }{' '}
                      <Tooltip title="Hoa hồng cho căn hộ này">
                        <span style={{fontStyle:'italic',fontSize:14,color:'red'}}> ( {villa?.commission?.commission_rate}%)</span>
                      </Tooltip>
                    </div>
                  </td>
                  {daysInMonth.map((day) => {
                    const bookingInfo = villa.calendar.find((item) => {
                      const date = new Date(item?.date);
                      const month = date.getUTCMonth() + 1;

                      const utcPlus7Date = new Date(Date.UTC(year, month - 1, day.day));
                      utcPlus7Date.setUTCHours(7, 0, 0, 0);
                      const formattedDate = utcPlus7Date.toISOString().split('T')[0];

                      return item.date.startsWith(formattedDate);
                    });
                    if (!bookingData) return null;

                    return (
                      <DayCell
                        key={day?.index}
                        day={day}
                        villa={villa}
                        handleCellClick={handleCellClick}
                        isCellSelected={isCellSelected}
                        bookingInfo={bookingInfo}
                        user_name={user_name}
                      />
                    );
                  })}
                </tr>
              ))}
              {totalPage !== currentPage && <LoadingRow columnsCount={daysInMonth.length} />}
              <tr ref={observerTarget}>
                <td colSpan={daysInMonth.length + 1} style={{ height: '1px', padding: 0 }}></td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
