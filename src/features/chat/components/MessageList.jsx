import ChatMessage from './ChatMessage';

function MessageList({ messages, isLoading }) {
    return (
        <div className="max-w-3xl mx-auto w-full pt-4 pb-24 text-left">
            {
                messages.length === 0 && (
                    <div className="h-[50vh] flex items-center justify-center">
                        <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Hello User, Ask me Anything
                        </h1>
                    </div>
                )
            }

            <div className="space-y-6">
                {
                    messages.map((message, index) => (
                        <ChatMessage
                            key={`${message.role}-${index}`}
                            message={message}
                        />
                    ))
                }

                {
                    isLoading && (
                        <div className="flex flex-col items-start animate-pulse">
                            <div className="text-xs font-semibold mb-1 text-zinc-500 uppercase tracking-wider">
                                AI
                            </div>

                            <div className="text-sm text-zinc-400 italic">
                                Thinking...
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default MessageList;