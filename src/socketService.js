import { io } from 'socket.io-client';

const websocketOrigin = process.env.REACT_APP_WEBSOCKET_ORIGIN;
const trucksSocket = io(websocketOrigin, {
  transports: ['websocket'],
  path: '/trucks',
  secure: true,
  reconnect: true,
});
trucksSocket.connect();

export default trucksSocket;
