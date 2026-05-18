export default function ChatHeader({ user, isOnline }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-10 h-10 rounded-full"
      />

      <div>
        <h2 className="font-semibold">{user.name}</h2>

        <p
          className={`text-xs ${
            isOnline ? "text-green-500" : "text-gray-400"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}