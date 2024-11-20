import { create } from 'zustand';





const listConversation: any[] = [];



export const useConversation = create<any>((set) => ({
  listConver: listConversation,
  listMsg: {},
  updateConversation: (payload: any) => {
    set(() => ({ listConver: payload }));

  

    set(() => ({
      listMsg: payload.reduce((acc: any, item: any) => {
        acc[item?.id] = [];  // Tạo key-value cho mỗi item.id
        return acc;  // Trả về đối tượng tích lũy
      }, {}),
    }));
  },

  updateMsg: (payload: any, group_id: any) => {
    // set((state: any) => ({
    //   listMsg: state.listMsg.map((item: any) =>
    //     item.group_id === +group_id ? { ...item, msg: [...item.msg, payload] } : item
    //   )
    // }));
    set((state:any) => {
      const updatedListMsg = { ...state.listMsg };

      updatedListMsg[group_id] = payload;

      return { listMsg: updatedListMsg };
    });
    // set((state:any)=>({listMsg:{...state.listMsg,msg:payload}}))
  },
}));

