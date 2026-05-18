let socket = null;

export const getSocket = (userId) => {
  // reuse existing socket
  if (
    socket &&
    (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    )
  ) {
    return socket;
  }

  // create new socket
  socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/chat?userId=${userId}`
  );

  socket.onopen = () => {
    console.log("✅ Socket connected");
  };

  socket.onclose = () => {
    console.log("❌ Socket disconnected");
  };

  socket.onerror = (err) => {
    console.log("Socket error:", err);
  };

  return socket;
};

export const sendSocketMessage = (data) => {
  if (!socket) {
    console.log("❌ No socket");
    return false;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.log("❌ Socket not open");
    return false;
  }

  socket.send(JSON.stringify(data));

  return true;
};