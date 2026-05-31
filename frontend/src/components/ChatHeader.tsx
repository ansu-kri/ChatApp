import type { ChatUser } from "./types";
import { Settings, LogOut, User, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLogoutMutation } from "../app/auth/authApi";
import { useNavigate } from "react-router-dom";
import AccountModal from "./AccountModal";
import { useGetMeQuery } from "@/app/userApi";

type Props = {
  user: Pick<ChatUser, "id" | "name" | "avatar" | "createdAt" | "lastSeen">;
  isOnline?: boolean;
  onBack?: () => void;
};

export default function ChatHeader({ user, isOnline, onBack }: Props) {
  const [logout, { isLoading }] = useLogoutMutation();
    console.log("ChatHeader user:", user);
  console.log("lastSeen:", user.lastSeen);
  console.log("isOnline:", isOnline);
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const { data: me } = useGetMeQuery();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div
        className={`flex items-center justify-between
        px-4 sm:px-6 py-3 sm:py-4
        bg-white/5 backdrop-blur-xl
        border-b border-white/10 shadow-sm
        transition-all duration-300
        ${openProfile ? "blur-sm scale-[0.99]" : ""}
      `}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="sm:hidden p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
          )}
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-cyan-400 shadow-lg"
            />

            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#0F172A] rounded-full"></span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-white text-base sm:text-lg truncate">
              {user.name}
            </h2>

            <p
              className={`text-xs sm:text-sm ${
                isOnline ? "text-green-400" : "text-gray-400"
              }`}
            >
              {isOnline
                ? "Online"
                : user.lastSeen
                  ? (() => {
                      const lastSeenDate = new Date(Date.parse(user.lastSeen));
                      const now = new Date();
                      const isToday =
                        lastSeenDate.toDateString() === now.toDateString();

                      const yesterday = new Date();
                      yesterday.setDate(now.getDate() - 1);
                      const isYesterday =
                        lastSeenDate.toDateString() ===
                        yesterday.toDateString();

                      const time = lastSeenDate.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata"
                      });

                      if (isToday) {
                        return `Last seen today at ${time}`;
                      }

                      if (isYesterday) {
                        return `Last seen yesterday at ${time}`;
                      }

                      return `Last seen ${lastSeenDate.toLocaleDateString(
                        "en-IN",
                      )}`;
                    })()
                  : "Offline"}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PROFILE */}
          <button
            onClick={() => setOpenProfile(true)}
            className="p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 transition-all duration-300 group"
          >
            <User
              size={18}
              className="sm:size-[20px] text-gray-300 group-hover:text-cyan-400"
            />
          </button>

          {/* SETTINGS */}
          <button className="p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-violet-500/20 border border-white/10 transition-all duration-300 group">
            <Settings
              size={18}
              className="sm:size-[20px] text-gray-300 group-hover:text-violet-400"
            />
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-all duration-300 group"
          >
            <LogOut size={18} className="sm:size-[20px] text-red-400" />
          </button>
        </div>
      </div>

      {/* PROFILE MODAL */}
      <AccountModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        user={{
          name: me?.name || "",
          avatar: me?.avatar || user.avatar,
          email: me?.email || "",
          createdAt: me?.createdAt || "",
        }}
      />
    </>
  );
}
