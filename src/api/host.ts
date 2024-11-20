import axiosClient from "src/utils/axiosClient";

import { endPoint } from "src/utils/endPoints";


const getHousekeepersRequest=async ()=>{
    const res =await axiosClient.get(endPoint.host.housekeeperRequest)

    return res
}
const  hostAcceptHouseKeeper=async (payload:any)=>{
    const res =await axiosClient.post(endPoint.host.acceptButler,payload)
    return res
}
const  hostRejectHouseKeeper=async (payload:any)=>{
    const res =await axiosClient.post(endPoint.host.rejectButler,payload)
    return res
}

export {
    getHousekeepersRequest,
    hostAcceptHouseKeeper,
    hostRejectHouseKeeper
}