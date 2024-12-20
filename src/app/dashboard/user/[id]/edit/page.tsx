// _mock
// import { _userList } from 'src/_mock/_user';
// sections
import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function UserEditPage() {


  return <UserEditView />;
}

// export async function generateStaticParams() {
//   return _userList.map((user) => ({
//     id: user.id,
//   }));
// }
