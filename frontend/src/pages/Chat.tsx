import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import type { ChatUser } from "../components/types";
import { useEffect, useMemo, useState } from "react";
import { useGetUsersQuery } from "../app/userApi";
import CreateGroupModal from "@/components/CreateGroupModal";
import { useGetGroupsQuery } from "@/app/groupApi";
import { useSelector } from "react-redux";
import type { Group } from "../components/Sidebar";

export default function Chat() {
  const { data: apiUsers = [], isLoading } = useGetUsersQuery();

  const [onlineUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [recentMessages, setRecentMessages] = useState<Record<string, string>>(
    {},
  );
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chats" | "groups">("chats");
  const userId = useSelector((state: any) => state.auth.user?.id)
  const { data: groups = [] } =
  useGetGroupsQuery(userId, {skip: !userId,});

const [selectedGroup, setSelectedGroup] =
  useState<Group | null>(null);

  const users: ChatUser[] = useMemo(
    () =>
      apiUsers.map((user) => ({
        id: user.id,
        name: user.name,
        avatar: `https://i.pravatar.cc/150?u=${user.id}`,
        recentMessage: recentMessages[user.id] || "",
        lastChatTime: "",
        chats: [],
        isOnline: onlineUsers.includes(user.id),
        typing: false,
        unreadCount: 0,
        lastSeen: user.lastSeen || "",
      })),

    [apiUsers, onlineUsers, recentMessages],
  );

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(null); // IMPORTANT: start empty
    }
  }, [users]);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="h-screen flex bg-[#f5f7fb] overflow-hidden">
      <div className={`${selectedUser ? "hidden sm:block" : "block"} sm:block`}>
        <Sidebar
          users={users}
  groups={groups}
  selectedUser={selectedUser}
  selectedGroup={selectedGroup}
  onSelectUser={setSelectedUser}
  onSelectGroup={setSelectedGroup}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  onCreateGroup={() => setIsCreateGroupOpen(true)}
        />
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatWindow
            key={selectedUser.id}
            user={selectedUser}
            onBack={() => setSelectedUser(null)}
            setRecentMessages={setRecentMessages}
          />
        ) : (
          <div className="flex-1 h-screen bg-gradient-to-br from-[#1a1325] via-[#20163a] to-[#0b0814] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-[#2a203d] flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                <svg
                  width="34"
                  height="34"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 10h8M8 14h5" />
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>

              <h1 className="text-4xl font-bold text-white mb-3">
                Welcome to Chatty!
              </h1>

              <p className="text-gray-400 text-lg">
                Select a conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
      <CreateGroupModal
      isOpen={isCreateGroupOpen}
      onClose={() => setIsCreateGroupOpen(false)}
      users={users}
    />
    </div>
  );
}
