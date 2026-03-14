import { LogOutIcon, VolumeOffIcon } from "lucide-react";

function ProfileHeader() {
  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          
          {/* AVATAR */}
          <div className="avatar online">
            <div className="size-14 rounded-full overflow-hidden relative group cursor-pointer">
              <img
                src="/avatar.png"
                alt="User image"
                className="size-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </div>
          </div>

          {/* USER INFO */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              John Doe
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-4 items-center">
          
          {/* LOGOUT BUTTON */}
          <button className="text-slate-400 hover:text-slate-200 transition-colors">
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND BUTTON */}
          <button className="text-slate-400 hover:text-slate-200 transition-colors">
            <VolumeOffIcon className="size-5" />
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;