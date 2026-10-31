import ChatMessage from './ChatMessage';
import Logo from '../../../shared/components/Logo';

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
                            <div role="img" aria-label="Assistant" className="mb-1">
                                <Logo size="small" />
                            </div>

                            <div
                                role="status"
                                className="flex max-w-[85%] items-center gap-1.5 rounded-2xl rounded-tl-none border border-zinc-700 bg-zinc-800 px-4 py-3"
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