function ChatSidebar({
    chatSessions,
    activeSessionId,
    isLoading,
    onNewChat,
    onSelectSession,
}) {
    return (
        <aside className="hidden md:flex flex-col col-span-1 border-r border-zinc-800 bg-zinc-950 p-2 h-full overflow-hidden">
            <button
                onClick={onNewChat}
                disabled={isLoading}
                className="w-full py-2.5 px-4 mb-6 rounded-full border border-zinc-700 text-zinc-200 text-xs font-medium hover:bg-zinc-800 hover:border-pink-500 transition-all cursor-pointer text-center"
            >
                + New Chat
            </button>

            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2 border-b border-zinc-700 pb-2">
                Recent Chats
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
                {
                    chatSessions.length === 0 && (
                        <div className="text-xs text-zinc-600 italic px-2 mt-2">
                            No recent chat sessions
                        </div>
                    )
                }

                {
                    chatSessions.map((session) => (
                        <button
                            key={session.id}
                            disabled={isLoading}
                            onClick={() => onSelectSession(session)}
                            className={`w-full text-left p-2 rounded-xl text-xs truncate font-medium transition-all cursor-pointer block ${
                                activeSessionId === session.id
                                    ? 'bg-zinc-800 border-l-2 border-pink-500 text-white shadow-md'
                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                            }`}
                            title={session.title}
                        >
                            💬 { session.title.length > 50 ? `${session.title.substring(0, 50)}...` : session.title }
                        </button>
                    ))
                }
            </div>
        </aside>
    );
}

export default ChatSidebar;