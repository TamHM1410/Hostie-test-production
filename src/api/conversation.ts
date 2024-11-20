import { endPoint } from "src/utils/endPoints";
import axios from "axios";



const getListConverSationById=async(user_id:any)=>{
try{
  

  const res =await axios.post('http://localhost:3003/api/v1/psql/msg/list',{
    user_id:user_id
  })
  return  res?.data?.result
    
}catch(error){
    throw new Error()
}
}

const getDetailConverSationById=async(sender_id:any,receiver_id:any)=>{
  try{
    
  
    const res =await axios.post('http://localhost:3003/api/v1/psql/msg/detail',{
      sender_id:sender_id,
      receiver_id:receiver_id
    })
    return  res?.data?.result
      
  }catch(error){
      throw new Error()
  }
  }
  
  

export {
    getListConverSationById,
    getDetailConverSationById
}