import { useState } from "react";
import { X, Users } from "lucide-react";
import { useCreateGroupMutation, useUploadImageMutation } from "@/app/groupApi";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
};

export default function CreateGroupModal({
  isOpen,
  onClose,
  users,
}: Props) {
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const [uploadImage] = useUploadImageMutation();

  if (!isOpen) return null;

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };


  const handleCreate = async () => {
    try {
      let imageUrl = "";
      //Upload image first if selected
      if(groupImage) {
        const imageResponse = await uploadImage(groupImage).unwrap();
        imageUrl = imageResponse.imageUrl;
      }
      const response = await createGroup({
        name: groupName,
        members: selectedMembers,
        groupImage: imageUrl,
      }).unwrap();
      console.log("group created:", response.groupId);

      //Reset form
      setGroupName("");
      setGroupImage(null);
      setSelectedMembers([]);
      onClose();
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };
  // const handleCreate = async () => {
  //   try {
  //     console.log({
  //       groupName,
  //       selectedMembers,
  //       groupImage,
  //     });

  //     onClose();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#181424] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className="text-purple-400" size={20} />
            <h2 className="text-lg font-semibold text-white">
              Create Group
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* GROUP NAME */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Group Name
            </label>

            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full bg-[#241d34] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
            />
          </div>

          {/* GROUP IMAGE */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              Group Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setGroupImage(e.target.files?.[0] || null)
              }
              className="w-full text-sm text-gray-400"
            />
          </div>

          {/* MEMBERS */}
          <div>
            <label className="text-sm text-gray-400 block mb-3">
              Select Members
            </label>

            <div className="max-h-56 overflow-y-auto space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleMember(user.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition
                    ${
                      selectedMembers.includes(user.id)
                        ? "bg-purple-600/20 border border-purple-500"
                        : "bg-[#241d34] border border-transparent hover:border-white/10"
                    }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <span className="text-white">
                    {user.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CREATE BUTTON */}
          <button
            onClick={handleCreate}
            disabled={
              isLoading ||
              !groupName.trim() ||
              selectedMembers.length === 0
            }
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            {isLoading ? "Creating..." : "craete Group"}
          </button>
        </div>
      </div>
    </div>
  );
}