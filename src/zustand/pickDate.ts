import { create } from 'zustand';



const currentDate = new Date();

const day = String(currentDate.getDate()).padStart(2, '0'); // Lấy ngày, đảm bảo có 2 chữ số
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Lấy tháng (cộng 1 vì getMonth() trả về giá trị từ 0-11)
const next_month = String(currentDate.getMonth() + 2).padStart(2, '0'); // Lấy tháng (cộng 1 vì getMonth() trả về giá trị từ 0-11)

const year = currentDate.getFullYear(); // Lấy năm

const startDate = `${day}-${month}-${year}`;
const endDate=`${day}-${next_month}-${year}`
const type = 'range';
const monthDefault = String(new Date().getMonth() + 1).padStart(2, '0');
const rangeDateDefault = {
  from: startDate,
  to: endDate,
};
const pageSize = 6;

export const useCurrentDate = create<any>((set) => ({
  typeOfDate: type,
  month: monthDefault,
  rangeDate: rangeDateDefault,
  pageSize: 20,
  totalPage: null,
  currentPage: null,
  updateHasMore: (total, current) => {
    set(() => ({
      totalPage: total,
    }));
    set(() => ({
      currentPage: current,
    }));
  },
  updatePageSize: () => {
    set((state) => ({
      pageSize: state.pageSize + 20,
    }));
  },
  monthRange: [month,next_month], // Khởi tạo như mảng rỗng, không phải chuỗi
  updateMonth: (payload: any) => {
    set(() => ({
      typeOfDate: 'month',
      month: payload,
    }));
  },

  updateRangeDate: (startDate: any, endDate: any, range: any) => {
    set(() => ({
      typeOfDate: 'range',
      rangeDate: {
        from: startDate,
        to: endDate,
      },
      monthRange: range,
    }));
  },
}));
