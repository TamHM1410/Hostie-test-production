import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_GOLANG_API

export const socket = io(URL,{
    reconnectionDelayMax: 10000,
});