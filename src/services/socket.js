import { io } from 'socket.io-client';
const baseURL = import.meta.env.VITE_SOCKET_URL 
const socket = io(baseURL);

socket.on('connect', () => {
  console.log('Conectado ao servidor Socket.IO:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor Socket.IO');
});

export default socket
