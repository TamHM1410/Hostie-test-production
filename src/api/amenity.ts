import axiosClient from 'src/utils/axiosClient';
import { endPoint } from 'src/utils/endPoints';

const finAllAmenity = async () => {
  return axiosClient.get(endPoint.admin.amenity.root);
};


const updateAmenityApi=async({id,payload}:{ id: any; payload: any })=>{
    return  await axiosClient.put(endPoint.admin.amenity.byId(id),payload,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

}
const deleteAmentityApi=async(id:any)=>{
    return await axiosClient.delete(endPoint.admin.amenity.byId(id))
}

const createdNewAmenityApi=async(payload:any)=>{
  return await axiosClient.post(endPoint.admin.amenity.root,payload)


}

export { finAllAmenity ,updateAmenityApi,deleteAmentityApi,createdNewAmenityApi};
