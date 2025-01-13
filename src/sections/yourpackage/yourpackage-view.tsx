'use client';

//  @hook

import { useQueries } from '@tanstack/react-query';
import { usePackage } from 'src/api/usePackage';

//  @mui

import { Box, Grid } from '@mui/material';

//  @component

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { SplashScreen, LoadingScreen } from 'src/components/loading-screen';

// import { getAllRolesApi } from 'src/api/users';

import PurchaseHistory from './package-purchase-history-view';
import CurrentPackage from './current-package';
import SuggestPackage from './suggest-package';
//  @api

export default function YourPackageView() {
  const {getCurrentPackage,getSuggestPackage,user_getPackage_history}=usePackage()
  const results = useQueries({
    queries: [
      {
        queryKey: ['currentPackage'],
        queryFn: async () => {
          const rs = await getCurrentPackage();
          return rs;
        },
      },
      {
        queryKey: ['suggestPackage'],
        queryFn: async () => {
          const rs = await getSuggestPackage();

          return rs;
        },
      },
      {
        queryKey: ['ppackageHistory'],
        queryFn: async () => {
          const rs = await user_getPackage_history();
          return rs;
        },
      },
    ],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  if (results.pending) return <LoadingScreen />;
  return (
    <Box>
      <Box sx={{ px: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ px: 5, pt: 15 }}>
              <Box
                sx={{
                  bgcolor: '#2468cd',
                  color: 'white',
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                }}
              >
                {results &&
                  Array.isArray(results.data) &&
                  results.data.length > 0 &&
                  results.data[0]?.packageInfo && (
                    <CurrentPackage
                      card={results.data[0]?.packageInfo}
                      expireAt={results.data[0]?.expireAt}
                      startAt={results.data[0]?.startAt}
                      daysLeft={results.data[0]?.daysLeft}
                    />
                  )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              {results &&
                Array.isArray(results.data) &&
                results.data.length > 0 &&
                results.data[1] && <SuggestPackage data={results.data[1]} />}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <CustomBreadcrumbs
        heading="Lịch sử mua gói của bạn"
        links={[{ name: '' }]}
        sx={{
          pt: 5,
          px: 5,
        }}
      />
      <Box sx={{ py: 5, px: 5 }}>
        <PurchaseHistory data={results.data[2]} />
      </Box>
    </Box>
  );
}
