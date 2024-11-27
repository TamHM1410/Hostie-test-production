import { io } from "socket.io-client";

const URL = 'http://34.81.244.146:3333'

export const socket = io(URL,{
    reconnectionDelayMax: 10000,
});