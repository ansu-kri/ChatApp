import { useMemo, useState } from "react";
import type { ChatUser } from "./types";
import { MessageSquare, Plus, Users } from "lucide-react";

export interface Group {
  id: string;
  name: string;
  members: string[];
  groupImage?: string;
}

type Props = {
  users: ChatUser[];
  groups: Group[];

  selectedUser?: ChatUser | null;
  selectedGroup?: Group | null;

  onSelectUser: (user: ChatUser) => void;
  onSelectGroup: (group: Group) => void;

  activeTab: "chats" | "groups";
  onTabChange: (tab: "chats" | "groups") => void;

  onCreateGroup: () => void;
};

export default function Sidebar({
  users,
  groups,

  selectedUser,
  selectedGroup,

  onSelectUser,
  onSelectGroup,

  activeTab,
  onTabChange,

  onCreateGroup,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [groups, search]);

  return (
    <aside className="w-full sm:w-[340px] h-screen sm:relative fixed sm:static inset-y-0 left-0 bg-gradient-to-br from-[#20163a] via-[#20163a] to-[#0b0814] border-r border-white/10 flex flex-col z-40">
      {/* HEADER */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">
            Chatty
          </h1>

          <button
            onClick={onCreateGroup}
            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 transition flex items-center justify-center text-white shadow-lg shadow-purple-500/20"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            activeTab === "chats"
              ? "Search users..."
              : "Search groups..."
          }
          className="w-full bg-[#1d1729] text-white placeholder:text-gray-500 px-4 py-3 rounded-xl outline-none border border-transparent focus:border-purple-500 transition-all"
        />

        {/* TABS */}
        <div className="mt-4 flex bg-[#171122] rounded-xl p-1">
          <button
            onClick={() => onTabChange("chats")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "chats"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare size={16} />
            Chats
          </button>

          <button
            onClick={() => onTabChange("groups")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "groups"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users size={16} />
            Groups
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3b2d56]">
        {activeTab === "chats" &&
          filteredUsers.map((user) => {
            const isActive =
              selectedUser?.id === user.id;

            return (
              <button
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={`w-full flex items-center gap-4 px-5 py-4 transition-all duration-200 border-l-4 ${
                  isActive
                    ? "bg-[#1f1830] border-purple-500"
                    : "border-transparent hover:bg-[#191325]"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                  />

                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-[#120d1b] rounded-full" />
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white truncate">
                      {user.name}
                    </h3>

                    <span className="text-xs text-gray-500">
                      {user.lastChatTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p
                      className={`text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[220px] ${
                        user.typing
                          ? "text-green-400 italic"
                          : "text-gray-400"
                      }`}
                    >
                      {user.typing
                        ? "typing..."
                        : user.recentMessage ||
                          "No messages yet"}
                    </p>

                    {!!user.unreadCount && (
                      <span className="ml-2 min-w-[20px] h-5 px-1 rounded-full bg-green-500 text-white text-[11px] flex items-center justify-center font-semibold">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

        {activeTab === "groups" &&
          filteredGroups.map((group) => {
            const isActive =
              selectedGroup?.id === group.id;

            return (
              <button
                key={group.id}
                onClick={() => onSelectGroup(group)}
                className={`w-full flex items-center gap-4 px-5 py-4 transition-all duration-200 border-l-4 ${
                  isActive
                    ? "bg-[#1f1830] border-purple-500"
                    : "border-transparent hover:bg-[#191325]"
                }`}
              >
                <img
                  src={
                    group.groupImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      group.name
                    )}`
                  }
                  alt={group.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                />

                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white truncate">
                    {group.name}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {group.members.length} members
                  </p>
                </div>
              </button>
            );
          })}

        {activeTab === "groups" &&
          filteredGroups.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No groups found
            </div>
          )}
      </div>
    </aside>
  );
}