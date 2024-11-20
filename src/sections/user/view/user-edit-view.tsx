'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView() {
  const settings = useSettingsContext();

  const currentUser ={
    id: 2,
  zipCode: '85807',
  state: 'Virginia',
  city: 'Rancho Cordova',
  role: 2,
  email: "hunhminhtam@gmail",
  address: '908 Jack Locks',
  name: 'Virginia',
  isVerified: false,
  company: 'Virginia',
  country: 'Virginia',
  avatarUrl: 'Virginia',
  phoneNumber: 'Virginia',
  status:'pending'
    // (index % 2 && 'pending') || (index % 3 && 'banned') || (index % 4 && 'rejected') || 'active',
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <UserNewEditForm currentUser={currentUser} /> */}
    </Container>
  );
}
