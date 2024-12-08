import { create } from 'zustand';


const report ={
    id:0,
    status:"",
    adminNote:""
};

export const useCurrentReport = create<any>((set) => ({
  report: report,

  updateReport: (payload: any) => {
    set(() => ({ report: payload }));
  },

}));
