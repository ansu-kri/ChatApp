import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useEffect, useState } from "react";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=3",
    recentMessage: "Hey there!",
    lastChatTime: "10:45 AM",
    chats: [
      {
        sender: "John",
        message: "Hey!",
        time: "10:30 AM",
      },
      {
        sender: "You",
        message: "Hello!",
        time: "10:31 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=5",
    recentMessage: "How are you?",
    lastChatTime: "11:15 AM",
    chats: [
      {
        sender: "Jane",
        message: "How are you?",
        time: "11:10 AM",
      },
    ],
  },
];

export default function Chat() {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  if (!selectedUser) {
    return <div>No users found</div>;
  }

  return (
    <div className="h-screen bg-[#f5f7fb] flex overflow-hidden">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />

      <ChatWindow
        user={selectedUser}
        setUsers={setUsers}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
}