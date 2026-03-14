import { XIcon } from "lucide-react";

function ChatHeader() {
  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
      border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        
        {/* Avatar */}
        <div className="avatar online">
          <div className="w-12 rounded-full">
            <img src="/avatar.png" alt="John Doe" />
          </div>
        </div>

        {/* User Info */}
        <div>
          <h3 className="text-slate-200 font-medium">John Doe</h3>
          <p className="text-slate-400 text-sm">Online</p>
        </div>
      </div>

      {/* Close Button */}
      <button>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;