'use client';

// @mui

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';
// _mock
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { SeoIllustration } from 'src/assets/illustrations';
//
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';
import { LoadingScreen } from 'src/components/loading-screen';
import { getDashboardAnalytic } from 'src/api/analytics';
import { getALlTransactionPackage } from 'src/api/pagekages';
import { useGetUserCurrentRole } from 'src/zustand/user';
import { useRouter } from 'next/navigation';
// ----------------------------------------------------------------------

export default function OverviewAppView() {

  const router=useRouter()

  const { userCurrentRole}=useGetUserCurrentRole()

  const myRef = useRef(null);

  

  const [adminList, setAdminList] = useState<any>([]);
  const [totalUser, setTotalUser] = useState<any>({
    percent_increase: 0,
    total: 0,
    total_butler: 0,
    total_host: 0,
    total_seller: 0,
    total_user_chuamuagoi: 0,
  });

  const [totalNewUser, setTotalNewUser] = useState<any>({
    total: 0,
    percent_increase: 0,
  });

  const [totalIncome, setTotalIncome] = useState<any>({
    total: 0,
    percent: 0,
  });

  const [registerUserByMonth, setRegisterUserByMonth] = useState<any>([]);

  const [totalIncomeByMonth, setTotalIncomeByMonth] = useState<any>([]);

  const [listPackage, setListPackage] = useState<any>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const limit = 5;
      const res = await getDashboardAnalytic();
      const newRegister = [];
      const newTotalIncome = [];
      const listTrans = [];

      const resListTransaction = await getALlTransactionPackage(limit);
      if (resListTransaction && Array.isArray(resListTransaction)) {
        listTrans.push(resListTransaction);
        setListPackage(listTrans);
      }

      if (res) {
        setAdminList(res?.admin_list);
        setTotalUser(res?.total_user);
        setTotalNewUser(res?.total_new_user);
        setTotalIncome(res?.total_income);

        if (res?.register_user_by_month) {
          newRegister.push(res?.register_user_by_month);

          setRegisterUserByMonth(newRegister);
        }
        if (res?.income_by_month) {
          newTotalIncome.push(res?.income_by_month?.series);
          setTotalIncomeByMonth(newTotalIncome);
        }
      }
      return res;
    },
  });

  console.log('list', listPackage);
  const { data: session } = useSession();

  const theme = useTheme();

  const settings = useSettingsContext();

  const handleScroll = () => {
    myRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  if(userCurrentRole==='USER'){
    router.push('/pricing')
  }
  if(userCurrentRole==='HOUSEKEEPER'){
    router.push('/dashboard/housekeepers')
  }
  if(userCurrentRole==='HOST' || userCurrentRole==='SELLER'){
    router.push('/dashboard/analytics')
  }
  if (isLoading) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title={`Mừng bạn trở lại  👋 \n ${session?.user.name}`}
            description="Hãy sẵn sàng theo dõi tiến độ, tối ưu hóa quy trình và biến mọi kế hoạch thành hiện thực."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary" onClick={handleScroll}>
                Bắt đầu ngay
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Tổng  người dùng"
            percent={totalUser.percent_increase}
            total={totalUser.total}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Tổng người dùng mới trong tháng"
            percent={totalNewUser.percent_increase}
            total={totalNewUser.total}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Tổng thu nhập"
            percent={totalIncome?.percent}
            total={totalIncome?.total}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4} ref={myRef}>
          <AppCurrentDownload
            title="Người dùng hiện tại"
            chart={{
              series: [
                { label: 'Chủ nhà', value: totalUser?.total_host },
                { label: 'Người bán', value: totalUser?.total_seller },
                { label: 'Quản gia', value: totalUser?.total_butler },
                { label: 'Người dùng chưa nâng cấp', value: totalUser?.total_user_chuamuagoi },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Người dùng đăng ký"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
              ],
              series: registerUserByMonth,
            }}
          />
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <AppAreaInstalled
            title="Tổng thu "
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
              ],
              series: totalIncomeByMonth[0],
            }}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="Giao dịch gần đây"
            tableData={listPackage[0]}
            tableLabels={[
              { id: 'registerId', label: 'Mã giao dịch' },
              { id: 'packageName', label: 'Tên gói' },
              { id: 'packagePrice', label: 'Giá' },
              { id: 'username', label: 'Người mua' },
              { id: 'status', label: 'Trạng thái' },
            ]}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Danh sách admin" list={adminList} type="admin" />
        </Grid>
      </Grid>
    </Container>
  );
}
