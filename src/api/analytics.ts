import { endPoint ,goEndPoint} from 'src/utils/endPoints';
import goAxiosClient from 'src/utils/goAxiosClient';
import axiosClient from 'src/utils/axiosClient';

export const getHostAnalytic =async ()=>{
    return await goAxiosClient.get(goEndPoint.analytic.host)
}
export const getTopResidence=async()=>{
    return await goAxiosClient.get(goEndPoint.analytic.host_top_residence)
}
export const getListSoldResidences=async()=>{
    return await goAxiosClient.get(goEndPoint.analytic.host_sold_residence)
}

export const getTopSeller=async ()=>{
    return await goAxiosClient.get(goEndPoint.analytic.top_seller)
}


////seller
export const getSellerAnalytic=async ()=>{
    return await goAxiosClient.get(goEndPoint.analytic.seller)
}

////dashboard


export const getDashboardAnalytic = async (): Promise< any> =>{
    return await axiosClient.get(endPoint.admin.analytic)
}