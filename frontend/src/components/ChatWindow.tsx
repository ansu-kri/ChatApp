import { useState, useEffect, useRef } from "react";
import type { ChatUser, ChatMessage } from "./types";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { getSocket, sendSocketMessage } from "../socket/socket";
import { useGetMeQuery } from "../app/userApi";
import {
  useDeleteMessageMutation,
  useEditMessageMutation,
  useGetMessageQuery,
} from "../app/messageApi";
import { skipToken } from "@reduxjs/toolkit/query";

type Props = {
  user: ChatUser;
  onBack?: () => void;
  setRecentMessages: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
};

export default function ChatWindow({ user, onBack, setRecentMessages }: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(
    null,
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meRef = useRef<any>(null);

  const { data: me } = useGetMeQuery();
  const [editMessageApi] = useEditMessageMutation();
  const [deleteMessageApi] = useDeleteMessageMutation();

  useEffect(() => {
    meRef.current = me;
  }, [me]);

  useEffect(() => {
    setMessage("");
  }, [user.id]);

  const { data: oldMessages } = useGetMessageQuery(
    me && user ? { senderId: me.id, receiverId: user.id } : skipToken,
  );

  // ================= SOCKET INIT =================
  useEffect(() => {
    if (!me?.id) return;
    if (socketRef.current) return;

    socketRef.current = getSocket(me.id);
  }, [me]);

  const socket = socketRef.current;

  // ================= LOAD OLD MESSAGES =================
  useEffect(() => {
    if (!oldMessages) return;

    const normalized = oldMessages.map((m: any) => ({
      id: m._id?.toString?.() || m.id,
      senderId: m.senderId,
      receiverId: m.receiverId,
      message: m.message,
      createdAt: m.createdAt,
      status: m.status || (m.seen ? "seen" : "sent"),
      seen: m.seen || false,
      edited: m.edited || false,
      deleted: m.deleted || false,
    }));

    setMessages(normalized);

    // ================= UPDATE SIDEBAR =================
    if (normalized.length > 0) {
      const lastMsg = normalized[normalized.length - 1];

      setRecentMessages((prev) => ({
        ...prev,

        [user.id]: lastMsg.deleted
          ? "This message was deleted"
          : lastMsg.message,
      }));
    }
  }, [oldMessages, user.id, setRecentMessages]);

  // ================= MARK AS SEEN =================
  useEffect(() => {
    if (!me?.id || !user?.id) return;

    sendSocketMessage({
      type: "seen",
      senderId: user.id,
      receiverId: me.id,
    });
  }, [user, me]);

  // ================= SOCKET EVENTS =================
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      // ONLINE USERS
      if (data.type === "online_list") {
        setOnlineUsers(data.users || []);
      }

      // USER ONLINE
      if (data.type === "user_online") {
        setOnlineUsers((prev) =>
          prev.includes(data.userId) ? prev : [...prev, data.userId],
        );
      }

      // USER OFFLINE
      if (data.type === "user_offline") {
        setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
      }

      // ================= NEW MESSAGE =================
      if (data.type === "message") {
        const newMessage = {
          ...data.data,
          id: data.data.id,
          status: data.data.status || "sent",
          edited: data.data.edited || false,
          deleted: data.data.deleted || false,
        };

        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === newMessage.id);

          if (exists) {
            return prev.map((msg) =>
              msg.id === newMessage.id ? { ...msg, ...newMessage } : msg,
            );
          }

          return [...prev, newMessage];
        });

        setRecentMessages((prev) => ({
          ...prev,

          [newMessage.senderId === meRef.current?.id
            ? newMessage.receiverId
            : newMessage.senderId]: newMessage.deleted
            ? "This message was deleted"
            : newMessage.message,
        }));

        //===Instant seen ====
        if (
          newMessage.receiverId === meRef.current?.id &&
          newMessage.senderId === user.id
        ) {
          sendSocketMessage({
            type: "seen",
            senderId: newMessage.senderId,
            receiverId: meRef.current.id,
          });
        }
      }

      // ================= SYNC MESSAGES =================
      if (data.type === "sync_messages") {
        const normalized = data.data.map((msg: any) => ({
          id: msg.id || msg._id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          message: msg.message,
          createdAt: msg.createdAt,
          status: msg.status || (msg.seen ? "seen" : "sent"),
          seen: msg.seen || false,
          edited: msg.edited || false,
          deleted: msg.deleted || false,
        }));

        setMessages((prev) => {
          const merged = [...prev];

          normalized.forEach((msg: ChatMessage) => {
            const index = merged.findIndex((m) => m.id === msg.id);

            if (index !== -1) {
              merged[index] = {
                ...merged[index],
                ...msg,
              };
            } else {
              merged.push(msg);
            }
          });

          return merged;
        });
      }

      // ================= MESSAGE EDITED =================
      if (data.type === "message_edited") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId
              ? {
                  ...msg,
                  message: data.message,
                  edited: true,
                }
              : msg,
          ),
        );
      }

      // ================= MESSAGE DELETED =================
      if (data.type === "message_deleted") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId
              ? {
                  ...msg,
                  deleted: true,
                  message: "",
                }
              : msg,
          ),
        );
      }

      // TYPING
      if (data.type === "typing") {
        setTypingUser(data.senderId);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser(null);
        }, 1200);
      }

      // ================= SEEN UPDATE (FIXED) =================
      if (data.type === "seen_update") {
        // const { senderId, receiverId } = data;

        setMessages((prev) =>
          prev.map((msg) => {
            if (data.messageIds?.includes(msg.id)) {
              return {
                ...msg,
                status: "seen",
                seen: true,
              };
            }
            return msg;
          }),
        );
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, user]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!message.trim() || !me?.id) return;

    // ================= EDIT MESSAGE =================
    if (editingMessage) {
      try {
        await editMessageApi({
          id: editingMessage.id!,
          message,
        }).unwrap();

        sendSocketMessage({
          type: "edit_message",
          messageId: editingMessage.id,
          message,
        });

        setEditingMessage(null);
        setMessage("");
      } catch (err) {
        console.error("Edit failed", err);
      }

      return;
    }

    // ================= NEW MESSAGE =================
    sendSocketMessage({
      type: "message",
      senderId: me.id,
      receiverId: user.id,
      message,
      createdAt: new Date().toISOString(),
    });

    setMessage("");
  };

  //Delete message
  const handleDeleteMessage = async (msg: ChatMessage) => {
    if (!msg.id) {
      console.error("❌ Cannot delete message: missing id", msg);
      return;
    }

    try {
      await deleteMessageApi(msg.id).unwrap();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, deleted: true, message: "" } : m,
        ),
      );
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditMessage = (msg: ChatMessage) => {
    setEditingMessage(msg);
    setMessage(msg.message);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-[#20163a] via-[#20163a] to-[#0b0814] ">
      {/* HEADER */}
      <div className="shadow-sm">
        <ChatHeader
          user={user}
          isOnline={onlineUsers.includes(user.id)}
          onBack={onBack}
        />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6 space-y-4">
        {/* WELCOME */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-500">
            Chat with {user.name}
          </h2>
          <p className="text-sm text-gray-400">Secure real-time messaging ⚡</p>
        </div>

        {/* MESSAGES */}
        <div className="space-y-3">
          {messages.map((chat) => (
            <div key={chat.id} className="animate-fadeIn">
              <MessageBubble
                message={chat}
                currentUserId={me?.id || ""}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            </div>
          ))}
        </div>

        {/* TYPING */}
        {typingUser === user.id && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow w-fit">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></span>
            <p className="text-sm text-gray-500">typing...</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="sticky bottom-0 px-4 md:px-8 py-4 bg-white/800 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto bg-white/800 rounded-2xl shadow-md px-3 py-2">
          <MessageInput
            message={message}
            setMessage={setMessage}
            onSend={sendMessage}
            socket={socket}
            meId={me?.id}
            receiverId={user.id}
          />
        </div>
      </div>
    </div>
  );
}
