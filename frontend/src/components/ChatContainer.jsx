import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

function ChatContainer() {
  const messages = [
    {
      id: 1,
      sender: "other",
      text: "Hey! How are you?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "I'm good! What about you?",
      time: "10:31 AM",
    },
    {
      id: 3,
      sender: "other",
      text: "Doing great. Are we meeting today?",
      time: "10:32 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "Yes, let's meet at 6 PM.",
      time: "10:33 AM",
    },
  ];

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat ${msg.sender === "me" ? "chat-end" : "chat-start"}`}
            >
              <div
                className={`chat-bubble relative ${
                  msg.sender === "me"
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                <p>{msg.text}</p>

                <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;