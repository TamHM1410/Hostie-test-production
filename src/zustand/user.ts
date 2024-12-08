import { getUserRole } from 'src/api/users';
import { create } from 'zustand';
import { getSession } from 'next-auth/react';

// Hàm lấy vai trò người dùng
const currentRole = async () => {
  try {
    const session = await getSession();
    // Nếu không có vai trò trong session hoặc vai trò là 'USER'
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
export const useGetUserCurrentRole = create<any>(async (set) => {
  set({ isLoading: true, userCurrentRole: null }); // Đặt trạng thái loading và userCurrentRole là null khi khởi tạo

  const role = await currentRole(); // Lấy vai trò người dùng từ API

  set({ 
    userCurrentRole: role,  // Cập nhật vai trò vào store
    isLoading: false,       // Đặt trạng thái loading là false khi hoàn tất
  });

  return {
    userCurrentRole: role,  // Trả về vai trò người dùng
    isLoading: false,       // Đảm bảo isLoading là false sau khi hoàn thành
    updateUserRole: (role: any) => set({ userCurrentRole: role }), // Cập nhật vai trò người dùng
  };
});
