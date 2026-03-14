import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  return (
    <div className="p-4 border-t border-slate-700/50">
      
      {/* Image Preview UI */}
      <div className="max-w-3xl mx-auto mb-3 flex items-center">
        <div className="relative">
          <img
            src="/avatar.png"
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-slate-700"
          />
          <button
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
            type="button"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..."
        />

        <button
          className="bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;