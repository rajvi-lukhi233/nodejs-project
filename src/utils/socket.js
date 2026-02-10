import { createMessage } from '../services/message.service.js';

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('Socket connected:', socket.id);
    socket.join(userId);

    socket.on('sendMessage', async (data) => {
      const { message, senderId, receiverId } = data;

      const newMessage = await createMessage({ message, senderId, receiverId });
      socket.to(receiverId).emit('receiveMessage', {
        success: true,
        data: newMessage,
      });
      socket.emit('messageSent', newMessage);
    });
    socket.on('disconnect', () => {
      console.log('Disconnect socket');
    });
  });
};
