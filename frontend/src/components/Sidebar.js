import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../app/auth/authApi";

export default function Sidebar({
  users,
  selectedUser,
  onSelectUser,
}) {
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[340px] bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <input
          placeholder="Search users..."
          className="w-full bg-gray-100 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-all
            ${
              selectedUser.id === user.id
                ? "bg-blue-50"
                : "hover:bg-gray-100"
            }`}
          >
            <img
              src={user.avatar}
              alt=""
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 truncate">
                  {user.name}
                </h3>

                <span className="text-xs text-gray-400">
                  {user.lastChatTime}
                </span>
              </div>

              <p className="text-sm text-gray-500 truncate">
                {user.recentMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="cursor-pointer p-4 bg-red-500 text-white"
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}