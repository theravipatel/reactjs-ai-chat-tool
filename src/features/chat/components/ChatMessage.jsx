
import ReactMarkdown from 'react-markdown';

function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div
            className={`flex flex-col ${
                isUser ? 'items-end' : 'items-start'
            }`}
        >
            <div className="text-xs font-semibold mb-1 text-zinc-500 uppercase tracking-wider">
                {isUser ? 'You' : 'AI'}
            </div>

            <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 tracking-wide leading-relaxed text-zinc-100 ${
                    isUser
                        ? 'bg-zinc-800 border border-zinc-700 rounded-tr-none'
                        : 'bg-transparent max-w-none w-full px-0'
                }`}
            >
                <ReactMarkdown>
                    {message.text}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default ChatMessage;