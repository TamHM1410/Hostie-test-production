'use client';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useUserManagement } from 'src/api/useUserManagement';
import { useSession } from 'next-auth/react';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';

import LinkCopy from './navCopied';
import Image from 'next/image';
import { C } from '@fullcalendar/core/internal-common';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { getUserReferralLink } = useUserManagement();

  const { data: session } = useSession();

  const { data } = useQuery({
    queryKey: ['referalLink'],
    queryFn: () => getUserReferralLink(),
  });

  console.log(data, 'data');

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      {
        data && (session?.user.roles === 'HOST' || session?.user.roles === 'SELLER') && <Stack alignItems="center">
          <Box sx={{ position: 'relative' }}>
            {/* <Avatar src={user?.photoURL} alt={user?.displayName} sx={{ width: 48, height: 48 }} /> */}
            <Box sx={{ bgcolor: '#078dee1c', p: 2, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ color: '#4b4242', py: 1, textAlign: 'start' }}>
                  <span style={{ color: 'black' }}>Nhận thưởng khi chia sẻ</span> <br />
                  Chia sẻ cho bạn bè để nhận ưu đãi bạn nhé
                </Box>
              </Box>
              <LinkCopy url={data}/>
            </Box>
          </Box>
      </Stack>
      }
     
    </Stack>
  );
}
