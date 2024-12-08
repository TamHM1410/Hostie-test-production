import goAxiosClient from 'src/utils/goAxiosClient';
import { goEndPoint } from 'src/utils/endPoints';

const getListConversation = async () => {
  const res = await goAxiosClient.get(goEndPoint.chat.getListConversion);

  return res;
};

const getListGroupMessage = async (id: any, page: any) => {
  const res = await goAxiosClient.get(goEndPoint.chat.listMessage(id), {
    params: {
      page_size: 10,
      page: page,
    },
  });

  console.log(res, 'res');
  return res;
};

const sendNewMessage = async (payload: any) => {
  const res = await goAxiosClient.post(goEndPoint.chat.sendMessage, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

export { getListConversation, getListGroupMessage, sendNewMessage };
