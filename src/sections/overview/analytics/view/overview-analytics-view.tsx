'use client';

// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
///@hook
import { useQueries } from '@tanstack/react-query';
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
import {
  getHostAnalytic,
  getTopResidence,
  getListSoldResidences,
  getTopSeller,
  getSellerAnalytic,
} from 'src/api/analytics';
//

import AnalyticsOrderTimeline from '../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';

import AnalyticsConversionRates from '../analytics-conversion-rates';
import AppTopAuthors from '../../app/app-top-authors';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();

  const { data: session } = useSession();

  const [thisYear, setThisYear] = useState<any>(null);
  const [lastYear, setLastYear] = useState<any>(null);

  const [sellThisYear, setSellThisYear] = useState<any>(null);

  const [sellLastYear, setSellLastYear] = useState<any>(null);

  const [listTopResidence, setListTopResidence] = useState<any>(null);
  const [listSoldResidence, setListSoldResidence] = useState<any>(null);
  const [topSeller, setTopSeller] = useState<any>(null);

  const [totalResidence, setTotalResidence] = useState(0);
  const [totalSellResidence, setTotalSellResidence] = useState(0);
  const [totalButler, setTotalButler] = useState(0);
  const [commission, setTotalCommission] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0.1);
  const [totalSellRevenue, setTotalSellRevenue] = useState(0);
  const [totalSellCommission, setTotalSellCommission] = useState(0);

  const results = useQueries({
    queries: [
      {
        queryKey: [
          session?.user?.roles === 'HOST' ? 'hostAnalytic' : 'sellerAnalytic',
          session?.user?.roles,
        ],
        queryFn: async () => {
          if (session?.user?.roles === 'HOST') {
            const res = await getHostAnalytic();

            if (res && res?.data && session?.user?.roles === 'HOST') {
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
          }

          const seller_res = await getSellerAnalytic();


          if (seller_res?.data) {
            const this_year = seller_res?.data?.income_by_month[0].data.map((item: any) => {
              return item?.this_year;
            });
            const last_year = seller_res?.data?.income_by_month[0].data.map((item: any) => {
              return item?.last_year;
            });

            setTotalSellResidence(seller_res?.data?.total_sold);

            setSellThisYear(this_year);
            setSellLastYear(last_year);
            setTotalCommission(seller_res?.data?.total_commission);
            // setTotalResidence(res?.data?.total_sold);
            setTotalSellRevenue(seller_res?.data?.total_revenue);
            setTotalSellCommission(seller_res?.data?.total_commission);
            // setTotalRevenue(res?.data?.total_revenue);
          }
          return seller_res?.data;
        },
      },
      {
        queryKey: ['topResidence'],
        queryFn: async () => {
          const res = await getTopResidence();

          if (res?.data && Array.isArray(res?.data?.items)) {
            const data = res?.data?.items.map((item) => {
              return {
                label: item?.residence_name,
                value: item?.total_value,
              };
            });
            setListTopResidence(data);
          }
          return res?.data;
        },
      },
      {
        queryKey: ['topSoldResidences'],
        queryFn: async () => {
          const res = await getListSoldResidences();

          if (res?.data && res?.data?.sold_residence) {
            setListSoldResidence(res?.data?.sold_residence);
          }
          return res?.data;
        },
      },
      {
        queryKey: ['topSeller'],
        queryFn: async () => {
          if (session?.user?.roles === 'HOST') {
            const res = await getTopSeller();
            if (res?.data) {
              setTopSeller(res?.data);
              return res?.data;
            }
          }

          return [];
        },
      },
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
        {session?.user?.roles === 'HOST' && (
          <Grid xs={12} sm={6} md={session?.user?.roles === 'HOST' ? 3 : 4}>
            <AnalyticsWidgetSummary
              title={
                session?.user?.roles === 'HOST' ? 'Tổng căn hộ' : ' Tổng villa & homestay đã bán'
              }
              total={totalResidence}
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          </Grid>
        )}
        {session?.user?.roles === 'HOST' && (
          <Grid xs={12} sm={6} md={session?.user?.roles === 'HOST' ? 3 : 4}>
            <AnalyticsWidgetSummary
              title={session?.user?.roles === 'HOST' ? 'Quản gia ' : ' Tổng doanh thu cho chủ nhà '}
              total={session?.user?.roles === 'HOST' ? totalButler : totalRevenue}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            />
          </Grid>
        )}
        {session?.user?.roles === 'HOST' && (
          <Grid xs={12} sm={6} md={session?.user?.roles === 'HOST' ? 3 : 4}>
            <AnalyticsWidgetSummary
              title={session?.user?.roles === 'HOST' ? 'Hoa hồng cho seller' : 'Hoa hồng của bạn '}
              total={commission}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
            />
          </Grid>
        )}

        {session?.user?.roles === 'HOST' && (
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Tổng thu"
              total={totalRevenue}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            />
          </Grid>
        )}

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title={' Tổng doanh thu cho chủ nhà '}
            total={totalSellRevenue}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title={' Tổng villa & homestay đã bán'}
            total={totalSellResidence}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title={'Hoa hồng của bạn '}
            total={totalSellCommission}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AnalyticsWebsiteVisits
            title="Thu nhập từng tháng "
            chart={{
              labels: [
                '01/01/2025',
                '02/01/2025',
                '03/01/2025',
                '04/01/2025',
                '05/01/2025',
                '06/01/2025',
                '07/01/2025',
                '08/01/2025',
                '09/01/2025',
                '10/01/2025',
                '11/01/2025',
                '11/01/2025',
                '12/01/2025',
              ],
              series: [
                {
                  name:
                    session?.user?.roles === 'HOST'
                      ? 'Tổng thu theo tháng (Đã khấu trừ hoa hồng)'
                      : 'Hoa hồng',
                  type: 'column',
                  fill: 'solid',
                  data: session?.user?.roles === 'HOST' ? thisYear : sellThisYear,
                },
                {
                  name:
                    session?.user?.roles === 'HOST' ? 'Tổng thu năm trước' : 'Hoa hồng năm trước',
                  type: 'area',
                  fill: 'gradient',
                  data: session?.user?.roles === 'HOST' ? lastYear : sellLastYear,
                },
              ],
            }}
          />
        </Grid>

        {session?.user?.roles === 'HOST' && (
          <Grid xs={12} md={6} lg={8}>
            <AppTopAuthors
              title="Top seller của bạn"
              list={Array.isArray(topSeller) ? topSeller : []}
            />
          </Grid>
        )}

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline
            title="Hoạt động gần đây"
            list={Array.isArray(listSoldResidence) ? listSoldResidence : []}
          />
        </Grid>
        <Grid
          xs={12}
          md={session?.user?.roles === 'HOST' ? 12 : 8}
          lg={session?.user?.roles === 'HOST' ? 12 : 8}
        >
          <AnalyticsConversionRates
            title={'Căn Villa & homestay đã bán'}
            chart={{
              series: Array.isArray(listTopResidence)
                ? listTopResidence
                : [{ label: 'Chưa có dữ liệu', value: 0 }],
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
