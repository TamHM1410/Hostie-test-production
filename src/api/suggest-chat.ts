import axiosClient from "src/utils/axiosClient";




export const getChatSuggest= async()=>{
    const response = await axiosClient.post(
        'https://api.cohere.ai/generate',
        {
            prompt: "suggest reply for this message in vietnamese :Anh yeu em  .please give me one correct result"
        },
        {
            headers: {
                'Authorization': `Bearer haaUZF2roE22vxq3FU8rygemIBHcYZm1AiEgHFuF`,
                'Content-Type': 'application/json',
            },
        }
    );
    return 
}
