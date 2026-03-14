function ActiveTabSwitch() {
  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      
      <button className="tab bg-cyan-500/20 text-cyan-400">
        Chats
      </button>

      <button className="tab text-slate-400">
        Contacts
      </button>

    </div>
  );
}

export default ActiveTabSwitch;