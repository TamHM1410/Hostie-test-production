import { create } from 'zustand';

const type = '';
const id=0

export const useCurrentPaymentType = create<any>((set) => ({
  type: type,
  package_id:id,
  updateType: (payload: any) => {
    set(() => ({ type: payload }));
  },
  updateId: (payload: any) => {
    set(() => ({ id: payload }));
  },

}));
