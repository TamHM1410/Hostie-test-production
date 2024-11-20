'use client'

import axiosClient from "src/utils/axiosClient"

import { useSession } from "next-auth/react"


export const useRefreshToken=async ()=>{
 
    const { data: session } = useSession();
    console.log('hihiiii')

    // const res = await axiosClient.post("/v1/api/auth/refresh-token", {
    //     token: session.user.token,
    //   });

}