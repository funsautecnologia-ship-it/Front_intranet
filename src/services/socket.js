import { io } from 'socket.io-client';
const baseURL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL).origin : 'https://intrahopital.onrender.com');

const socket = io(baseURL);

socket.on('connect', () => {
  console.log('Conectado ao servidor Socket.IO:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor Socket.IO');
});

export default socket
