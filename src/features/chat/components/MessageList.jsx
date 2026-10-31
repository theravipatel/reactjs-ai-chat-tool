import ChatMessage from './ChatMessage';

function MessageList({ messages, isLoading }) {
    const displayName = localStorage.getItem('display_name')?.trim() || 'there';

    return (
        <div className="max-w-3xl mx-auto w-full pt-4 pb-24 text-left">
            {
                messages.length === 0 && (
                    <div className="h-[50vh] flex items-center justify-center">
                        <h1 className="text-4xl text-center font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            What are we exploring today, {displayName}?
                        </h1>
                    </div>
                )
            }

            <div className="space-y-6">
                {
                    messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                        />
                    ))
                }

                {
                    isLoading && (
                        <div className="flex flex-col items-start">
                            <div className="text-xs font-semibold mb-1 text-zinc-500 uppercase tracking-wider">
                                AI
                            </div>

                            <div
                                role="status"
                                className="flex items-center gap-1.5 py-2"
                            >
                                <span className="sr-only">
                                    AI is thinking...
                                </span>

                                {[0, 1, 2].map((dot) => (
                                    <span
                                        key={dot}
                                        className="h-2 w-2 rounded-full bg-pink-400 animate-bounce"
                                        style={{
                                            animationDelay: `${dot * 150}ms`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    );
}

export default MessageList;