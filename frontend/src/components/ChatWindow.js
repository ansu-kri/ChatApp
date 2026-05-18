import { useState, useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

import {
  getSocket,
  sendSocketMessage,
} from "../socket/socket";

import { useGetMeQuery } from "../app/userApi";
import { useGetMessageQuery } from "../app/messageApi";

import { skipToken } from "@reduxjs/toolkit/query";

export default function ChatWindow({ user }) {
  // =========================
  // STATE
  // =========================
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  const [typingUser, setTypingUser] =
    useState(null);

  // =========================
  // REFS
  // =========================
  const bottomRef = useRef(null);

  const socketRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  // =========================
  // LOGGED USER
  // =========================
  const { data: me } = useGetMeQuery();

  // =========================
  // FETCH OLD MESSAGES
  // =========================
  const { data: oldMessages } =
    useGetMessageQuery(
      me && user
        ? {
            senderId: me.id,
            receiverId: user.id,
          }
        : skipToken
    );

  // =========================
  // INIT SOCKET ONCE
  // =========================
  useEffect(() => {
    if (!me?.id) return;

    // already exists
    if (socketRef.current) return;

    socketRef.current = getSocket(me.id);
  }, [me]);

  const socket = socketRef.current;

  // =========================
  // LOAD OLD MESSAGES
  // =========================
  useEffect(() => {
    if (oldMessages) {
      setMessages(oldMessages);
    }
  }, [oldMessages]);

  // =========================
  // MARK AS SEEN
  // =========================
  useEffect(() => {
    if (!me?.id || !user?.id) return;

    sendSocketMessage({
      type: "seen",
      senderId: user.id,
      receiverId: me.id,
    });
  }, [user, me]);

  // =========================
  // SOCKET EVENTS
  // =========================
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      // =====================
      // ONLINE USERS
      // =====================
      if (data.type === "online_list") {
        setOnlineUsers(data.users || []);
      }

      // =====================
      // USER ONLINE
      // =====================
      if (data.type === "user_online") {
        setOnlineUsers((prev) => {
          if (prev.includes(data.userId)) {
            return prev;
          }

          return [...prev, data.userId];
        });
      }

      // =====================
      // USER OFFLINE
      // =====================
      if (data.type === "user_offline") {
        setOnlineUsers((prev) =>
          prev.filter(
            (id) => id !== data.userId
          )
        );
      }

      // =====================
      // NEW MESSAGE
      // =====================
      if (data.type === "message") {
        const newMessage = data.data;

        // avoid duplicates
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg.createdAt ===
                newMessage.createdAt &&
              msg.senderId ===
                newMessage.senderId
          );

          if (exists) return prev;

          return [...prev, newMessage];
        });
      }

      // =====================
      // TYPING
      // =====================
      if (data.type === "typing") {
        setTypingUser(data.senderId);

        // clear old timeout
        if (typingTimeoutRef.current) {
          clearTimeout(
            typingTimeoutRef.current
          );
        }

        // hide after delay
        typingTimeoutRef.current =
          setTimeout(() => {
            setTypingUser(null);
          }, 1200);
      }

      // =====================
      // MISSED MESSAGES
      // =====================
      if (data.type === "sync_messages") {
        setMessages((prev) => [
          ...prev,
          ...data.data,
        ]);
      }

      // =====================
      // SEEN UPDATE
      // =====================
      if (data.type === "seen_update") {
        setMessages((prev) =>
          prev.map((msg) => {
            if (
              msg.senderId === me?.id
            ) {
              return {
                ...msg,
                seen: true,
              };
            }

            return msg;
          })
        );
      }
    };

    socket.addEventListener(
      "message",
      handleMessage
    );

    return () => {
      socket.removeEventListener(
        "message",
        handleMessage
      );
    };
  }, [socket, me]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = () => {
    if (!message.trim()) return;

    if (!me?.id) return;

    const success =
      sendSocketMessage({
        senderId: me.id,
        receiverId: user.id,
        message,
        createdAt:
          new Date().toISOString(),
      });

    if (success) {
      setMessage("");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader
        user={user}
        isOnline={onlineUsers.includes(
          user.id
        )}
      />

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-3 bg-[#f5f7fb]">
        {messages.map((chat, i) => (
          <MessageBubble
            key={i}
            message={chat}
            currentUserId={me?.id || ""}
          />
        ))}

        {/* TYPING */}
        {typingUser === user.id && (
          <p className="text-sm text-gray-500 px-2">
            typing...
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={sendMessage}
        socket={socket}
        meId={me?.id}
        receiverId={user.id}
      />
    </div>
  );
}