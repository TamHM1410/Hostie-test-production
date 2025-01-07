import { getUserRole } from 'src/api/users';
import { create } from 'zustand';

import { getSession ,useSession} from 'next-auth/react';

// Hàm lấy vai trò người dùng
const currentRole = async () => {
  try {
    const session = await getSession();
    // Nếu không có vai trò trong session hoặc vai trò là 'USER'
    if( session && session.user?.roles === 'USER'){
      const res = await getUserRole();
      if (Array.isArray(res) && res.length > 0) {
        return res[0]; // Trả về vai trò đầu tiên trong mảng
      }
    }
    if (
      !session?.user.roles ||
      (typeof session?.user.roles === 'string' && session.user.roles === 'USER')
    ) {
      const res = await getUserRole();
      if (Array.isArray(res) && res.length > 0) {
        return res[0]; // Trả về vai trò đầu tiên trong mảng
      }
    }
    return session?.user.roles || null; // Trả về vai trò từ session nếu có
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null; // Trả về null nếu có lỗi
  }
};

// Store Zustand - gọi hàm `currentRole` để lấy vai trò ngay khi khởi tạo
export const useGetUserCurrentRole = create((set) => ({
  isLoading: true,
  userCurrentRole: null,
  updateUserRole: (role: any) => set({ userCurrentRole: role }),
  fetchUserRole: async () => {
    set({ isLoading: true });
    try {
      const role = await currentRole();
      set({
        userCurrentRole: role,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      set({ isLoading: false });
    }
  },
}));