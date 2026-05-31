export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  status: "sent" | "delivered" | "seen";
  seen?: boolean;
  edited?: boolean;
  deleted?: boolean;
};

export type ChatUser = {
  id: string;
  name: string;
  avatar: string;
  recentMessage: string;
  lastChatTime: string;
  chats: ChatMessage[];
  isOnline: boolean;
  typing?: boolean;
  unreadCount?: number;
  createdAt?: string;
  lastSeen?: string;
};