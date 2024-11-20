import axiosClient from "src/utils/axiosClient";
import { endPoint } from "src/utils/endPoints";


const findAllResidenceType=async()=>{
    const res =await axiosClient.get(endPoint.admin.residence_types.root)
    return  res

}

const create_new_residence_type=async(payload:any)=>{
    const res=await axiosClient.post(endPoint.admin.residence_types.root,payload)
    return res
}

const update_residence_type=async(payload:any,id:any)=>{
    const res=await axiosClient.put(endPoint.admin.residence_types.byId(id),payload)
    return res
}
const delete_residence_type=async(id:any)=>{

    const res=await axiosClient.delete(endPoint.admin.residence_types.byId(id))
    return res
}

export {
    findAllResidenceType,
    create_new_residence_type,
    update_residence_type,
    delete_residence_type
}