import {
  Camera,
  Mail,
  ShieldCheck,
  CalendarDays,
  User,
  X,
} from "lucide-react";

import { useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    avatar: string;
    email?: string;
    createdAt?: string;
  };
};

export default function AccountModal({
  open,
  onClose,
  user,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState(user.avatar);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    // upload image to cloudinary/backend here
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111827]/95 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-red-500/20 transition"
        >
          <X className="text-white" size={18} />
        </button>

        {/* TOP */}
        <div className="px-5 pt-5 pb-4 flex flex-col items-center border-b border-white/10">
          <div className="relative">
            <img
              src={preview}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400 shadow-xl"
            />

            {/* CAMERA BUTTON */}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
              <Camera className="text-white" size={16} />
            </button>

            {/* HIDDEN INPUT */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>

          <h1 className="mt-3 text-2xl font-bold text-white">
            {user.name}
          </h1>

          <p className="text-gray-400 text-sm">
            Your profile information
          </p>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <User size={16} />
              Full Name
            </label>

            <input
              type="text"
              value={user.name}
              className="w-full h-11 px-4 rounded-xl bg-[#1F2937] border border-white/10 text-white outline-none"
              readOnly
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email Address
            </label>

            <input
              type="email"
              value={user.email}
              className="w-full h-11 px-4 rounded-xl bg-[#1F2937] border border-white/10 text-white outline-none"
              readOnly
            />
          </div>

          {/* ACCOUNT INFO */}
          <div className="rounded-2xl bg-[#1F2937]/60 border border-white/10 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Account Information
            </h2>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-400">
                <CalendarDays size={17} />
                Member Since
              </div>

              <span className="text-gray-200">
                {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-400">
                <ShieldCheck size={17} />
                Status
              </div>

              <span className="text-green-400 font-semibold">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}