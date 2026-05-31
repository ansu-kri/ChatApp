let sockets: Record<string, WebSocket> = {};
let currentUserId: string | null = null;

export const getSocket = (userId: string) => {
  currentUserId = userId;

  const key = "private";

  if (sockets[key]?.readyState === WebSocket.OPEN) {
    return sockets[key];
  }

  if (sockets[key]?.readyState === WebSocket.CONNECTING) {
    return sockets[key];
  }

  sockets[key] = new WebSocket(
    `ws://127.0.0.1:8000/ws/chat?userId=${userId}`
  );

  sockets[key].onopen = () => {
    console.log("Private socket connected");
  };

  sockets[key].onclose = () => {
    console.log(" Private socket closed");

    setTimeout(() => {
      if (currentUserId) getSocket(currentUserId);
    }, 1500);
  };

  return sockets[key];
};

export const getGroupSocket = (groupId: string) => {
  const key = `group_${groupId}`;

  if (sockets[key]?.readyState === WebSocket.OPEN) {
    return sockets[key];
  }

  if (sockets[key]?.readyState === WebSocket.CONNECTING) {
    return sockets[key];
  }

  sockets[key] = new WebSocket(
    `ws://127.0.0.1:8000/ws/group/${groupId}`
  );

  sockets[key].onopen = () => {
    console.log("Group socket connected:", groupId);
  };

  sockets[key].onclose = () => {
    console.log(" Group socket closed:", groupId);
  };

  sockets[key].onerror = (err) => {
    console.log(" Group socket error:", err);
  };

  return sockets[key];
};

export const sendSocketMessage = (
  data: any,
  type: "private" | "group" = "private",
  id?: string
) => {
  let socket;

  if (type === "group" && id) {
    socket = sockets[`group_${id}`];
  } else {
    socket = sockets["private"];
  }

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.log(" Socket not ready");
    return false;
  }

  try {
    socket.send(JSON.stringify(data));
    return true;
  } catch (err) {
    console.log(" Send failed:", err);
    return false;
  }
};