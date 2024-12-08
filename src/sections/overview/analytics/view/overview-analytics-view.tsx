'use client';

// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
///@hook
import { useQuery, useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';

/// @api
import { getHostAnalytic,getTopResidence ,getListSoldResidences,getTopSeller,getSellerAnalytic} from 'src/api/analytics';
//
import AnalyticsNews from '../analytics-news';
import AnalyticsTasks from '../analytics-tasks';
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsOrderTimeline from '../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsConversionRates from '../analytics-conversion-rates';
import AppTopAuthors from '../../app/app-top-authors';
import { useGetUserCurrentRole } from 'src/zustand/user';
import { LoadingScreen } from 'src/components/loading-screen';
import { label } from 'yet-another-react-lightbox';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();

  const { userCurrentRole } = useGetUserCurrentRole();

  const [thisYear, setThisYear] = useState<any>(null);
  const [lastYear, setLastYear] = useState<any>(null);
  const [listTopResidence,setListTopResidence]=useState<any>(null)
  const [listSoldResidence,setListSoldResidence]=useState<any>(null)
  const [topSeller,setTopSeller]=useState<any>(null)


  const [totalResidence, setTotalResidence] = useState(0);
  const [totalButler, setTotalButler] = useState(0);
  const [commission, setTotalCommission] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const results = useQueries({
    queries: [
      {
        queryKey: [userCurrentRole === 'HOST' ? 'hostAnalytic' : 'sellerAnalytic', userCurrentRole],
        queryFn: async () => {
          const res = userCurrentRole === 'HOST'  ? await getHostAnalytic() : await getSellerAnalytic();
          console.log('resss',res)


          if (res?.data && userCurrentRole === 'HOST' ) {
            const this_year = res?.data?.income_by_month[0].data.map((item: any) => {
              return item?.this_year;
            });
            const last_year = res?.data?.income_by_month[0].data.map((item: any) => {
              return item?.last_year;
            });
            setTotalResidence(res?.data?.total_residence);
            setTotalButler(res?.data?.total_butler);
            setTotalCommission(res?.data?.total_commission);
            setTotalRevenue(res?.data?.total_revenue);

            setThisYear(this_year);
            setLastYear(last_year);
          }
          if( res?.data && userCurrentRole === 'SELLER' ){
            const this_year = res?.data?.income_by_month[0].data.map((item: any) => {
              return item?.this_year;
            });
            const last_year = res?.data?.income_by_month[0].data.map((item: any) => {
              return item?.last_year;
            });
            setThisYear(this_year);
            setLastYear(last_year);
            setTotalCommission(res?.data?.total_commission);
            setTotalResidence(res?.data?.total_sold);
            setTotalRevenue(res?.data?.total_revenue);




          }
          return res?.data;
        },
      },
      {
        queryKey:['topResidence'],
        queryFn:async ()=>{
          const res=await getTopResidence()
          if(res?.data && Array.isArray(res?.data)){
            const data=res?.data.map((item)=>{
              return {
                label:item?.residence_name,
                value:item?.total_value
              }
            })
            setListTopResidence(data)

          }
          return res?.data
        }
      },
      {
        queryKey:['topSoldResidences'],
        queryFn:async()=>{
          const res =await getListSoldResidences()
          console.log('croeoen',res?.data)

          if(res?.data && res?.data?.sold_residence){
            setListSoldResidence(res?.data?.sold_residence)
          }
          return res?.data

        }
      },
      {
        queryKey:['topSeller'],
        queryFn:async()=>{
          if(userCurrentRole === 'HOST'){
            const res =await getTopSeller()
            if(res?.data){
              setTopSeller(res?.data)
              return res?.data

            }

          }
         
          return []
        }
      }
      
    ],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
        loading: results.some((result) => result.isLoading),
      };
    },
  });

  if (results.loading) {
    return <LoadingScreen />;
  }
  console.log(totalResidence,'sold')

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Mừng bạn trở lại 👋{' '}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={userCurrentRole === 'HOST' ? 3 : 4}>
          <AnalyticsWidgetSummary
            title={userCurrentRole === 'HOST' ? 'Tổng căn hộ' : ' Tổng villa & homestay đã bán'}
            total={totalResidence}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={userCurrentRole === 'HOST' ? 3 : 4}>
          <AnalyticsWidgetSummary
            title={userCurrentRole === 'HOST' ? 'Quản gia ' : ' Tổng doanh thu cho chủ nhà '}
            total={totalButler}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={userCurrentRole === 'HOST' ? 3 : 4}>
          <AnalyticsWidgetSummary
            title={
              Array.isArray(results) && userCurrentRole === 'HOST'
                ? 'Hoa hồng cho seller'
                : 'Hoa hồng của bạn'
            }
            total={commission}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        {userCurrentRole === 'HOST' && (
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Tổng thu"
              total={totalRevenue}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            />
          </Grid>
        )}

        <Grid xs={12} md={12} lg={12}>
          <AnalyticsWebsiteVisits
            title="Thu nhập từng tháng "
            chart={{
              labels: [
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
                '05/01/2024',
                '06/01/2024',
                '07/01/2024',
                '08/01/2024',
                '09/01/2024',
                '10/01/2024',
                '11/01/2024',
                '11/01/2024',
                '12/01/2024',
              ],
              series: [
                {
                  name:
                    userCurrentRole === 'HOST'
                      ? 'Tổng thu theo tháng (Đã khấu trừ hoa hồng)'
                      : 'Hoa hồng',
                  type: 'column',
                  fill: 'solid',
                  data: Array.isArray(thisYear) ? thisYear : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
                {
                  name: userCurrentRole === 'HOST' ? 'Tổng thu năm trước' : 'Hoa hồng năm trước',
                  type: 'area',
                  fill: 'gradient',
                  data: Array.isArray(lastYear) ? lastYear : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                },
              ],
            }}
          />
        </Grid>

      
      {userCurrentRole === 'HOST' && <Grid xs={12} md={6} lg={8}>
          <AppTopAuthors title="Top seller của bạn" list={Array.isArray(topSeller )? topSeller :[]}/>
        </Grid>}   
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Hoạt động gần đây" list={Array.isArray(listSoldResidence) ? listSoldResidence :[]} />
        </Grid>
        <Grid xs={12} md={userCurrentRole === 'HOST'? 12:8} lg={userCurrentRole === 'HOST' ?12:8}>
          <AnalyticsConversionRates
            title={
              userCurrentRole === 'HOST' ? 'Tổng  thu từng căn' : 'Căn Villa & homestay đã bán'
            }
            chart={{
              series:Array.isArray(listTopResidence) ? listTopResidence : [
                { label: 'Chưa có dữ liệu', value: 0 },
              
              ],
            }}
          />
        </Grid>
        
        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_analyticTasks} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
