import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

function ContactList() {
  const contacts = [
    {
      id: 1,
      name: "John Doe",
      avatar: "/avatar.png",
      status: "online",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      avatar: "/avatar.png",
      status: "offline",
    },
    {
      id: 3,
      name: "Michael Smith",
      avatar: "/avatar.png",
      status: "online",
    },
  ];

  return (
    <>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${contact.status === "online" ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={contact.avatar} alt={contact.name} />
              </div>
            </div>

            <h4 className="text-slate-200 font-medium">
              {contact.name}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}

export default ContactList;