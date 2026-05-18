export default function MessageBubble({ message, currentUserId }) {
  const isMe = message.senderId === currentUserId;
  const isSeen = message.isSeen;

  return (
    <div className={`w-full flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[320px]
          px-4
          py-2
          rounded-2xl
          shadow-sm
          break-words
          ${
            isMe
              ? "bg-[#d9fdd3] text-black rounded-br-md"
              : "bg-white text-black rounded-bl-md"
          }
        `}
      >
        <p className="text-sm">{message.message}</p>

        <div className="text-[11px] text-gray-500 text-right mt-1 flex justify-end gap-1 items-center">
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMe && (
            <span className={isSeen ? "text-blue-500" : "text-gray-400"}>
              {isSeen ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}