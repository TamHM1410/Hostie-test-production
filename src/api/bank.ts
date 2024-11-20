import axiosClient from "src/utils/axiosClient";
import { endPoint } from "src/utils/endPoints";



const getBankList =async ()=>{
    const res =await axiosClient.get(endPoint.bank)
    return res
}


export {
    getBankList
}