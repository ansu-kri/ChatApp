import { useRef, useState } from "react";
// import API from "../app/api";

type Props = {
  message: string;
  setMessage: (val: string) => void;
  onSend: () => void;
  socket?: WebSocket | null;
  meId?: string;
  receiverId?: string;
};

export default function MessageInput({
  message,
  setMessage,
  onSend,
  socket,
  meId,
  receiverId,
}: Props) {
  const typingCooldownRef = useRef(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);

  // FIXED TYPES
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleTyping = () => {
    if (!socket || !meId || !receiverId) return;
    if (socket.readyState !== WebSocket.OPEN) return;
    if (typingCooldownRef.current) return;

    typingCooldownRef.current = true;

    socket.send(
      JSON.stringify({
        type: "typing",
        senderId: meId,
        receiverId,
      })
    );

    setTimeout(() => {
      typingCooldownRef.current = false;
    }, 1500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          const formData = new FormData();

          formData.append("file", audioBlob, "voice.webm");

          // Upload API
          // const res = await API.posts(
          //   "/api/upload/audio",
          //   formData
          // );

          socket?.send(
            JSON.stringify({
              type: "audio",
              senderId: meId,
              receiverId,
              // audio: res.data.audioUrl,
            })
          );
        } catch (err) {
          console.error("Upload failed:", err);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Mic permission denied:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleFilePick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log("Selected file:", file);
  };

  const addEmoji = (emoji: string) => {
    setMessage(message + emoji);
  };

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="flex items-end gap-2 sm:gap-3 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl p-2 sm:p-3">
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-1 sm:gap-2">
          
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
          >
            😊
          </button>

          <button
            onClick={handleFilePick}
            className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
          >
            📎
          </button>

          {!recording ? (
            <button
              onClick={startRecording}
              className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
            >
              🎙
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
            >
              Stop
            </button>
          )}
        </div>

        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 px-2 py-2"
          placeholder="Type a message..."
        />

        <button
          onClick={onSend}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 active:scale-95 transition text-white px-4 sm:px-6 py-2 rounded-xl shadow-md font-medium"
        >
          Send
        </button>
      </div>

      {showEmoji && (
        <div className="mt-2 flex gap-2 flex-wrap bg-white border rounded-xl p-2 shadow">
          {["😀", "😂", "😍", "😎", "😭", "👍", "🔥", "🎉"].map((e) => (
            <button
              key={e}
              onClick={() => addEmoji(e)}
              className="text-xl hover:scale-110 transition"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}