import { useState } from "react";
import type { ChatMessage } from "./types";

type Props = {
  message: ChatMessage;
  currentUserId: string;
  onEdit?: (msg: ChatMessage) => void;
  onDelete?: (msg: ChatMessage) => void;
};

export default function MessageBubble({
  message,
  currentUserId,
  onEdit,
  onDelete,
}: Props) {
  console.log("MESSAGE:", message);
  const isMe = message.senderId === currentUserId;
  const [showActions, setShowActions] = useState(false);
  const messageId = message.id;

  return (
    <div className={`w-full flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={() => setShowActions((prev) => !prev)}
        className={` relative max-w-[320px] px-4 py-2 rounded-2xl shadow-sm break-words text-sm leading-relaxed transition-all duration-200
    ${
      message.deleted
        ? "bg-gray-100 text-gray-400 italic"
        : isMe
          ? "bg-gradient-to-r from-green-200 to-green-100 text-black rounded-br-md"
          : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
    }
  `}
      >
        {/* Action */}
        {isMe && showActions && !message.deleted && (
          <div className="absolute -bottom-6 right-0 z-50 flex gap-2 bg-white shadow rounded-lg px-2 py-1 border">
            <button
              onClick={() => onEdit?.(message)}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>

            <button
              onClick={() => messageId && onDelete?.(message)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        )}
        {/* MESSAGE */}
        <p className="text-sm">
          {Boolean(message.deleted) ? (
            <span className="italic text-gray-400">
              This message was deleted
            </span>
          ) : (
            message.message
          )}
        </p>
        {/* FOOTER */}

        <div className="text-[11px] text-gray-500 mt-1 flex justify-end gap-1 items-center">
          {Boolean(message.edited) && !Boolean(message.deleted) && (
            <span className="italic">edited</span>
          )}
          <span>
            {new Date(message.createdAt).toLocaleTimeString("en-IN", {
              // timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>

          {isMe && (
            <span
              className={
                message.status === "seen" ? "text-blue-500" : "text-gray-400"
              }
            >
              {message.status === "sent" && "✓"}
              {message.status === "delivered" && "✓✓"}
              {message.status === "seen" && "✓✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
