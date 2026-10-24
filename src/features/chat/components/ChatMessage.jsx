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
                className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-3 text-zinc-100 ${
                    isUser
                        ? 'bg-zinc-800 border border-zinc-700 rounded-tr-none whitespace-pre-wrap wrap-break-word'
                        : 'bg-transparent max-w-none w-full px-0'
                }`}
            >
                <div className="wrap-break-word [&_p]:mb-3 [&_p:last-child]:mb-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1 [&_a]:text-pink-400 [&_a]:underline [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:rounded-lg [&_pre]:bg-zinc-800 [&_pre]:p-4 [&_pre]:mb-3 [&_code]:wrap-break-word [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-zinc-800 [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:py-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-300">
                    <ReactMarkdown>
                        {message.text}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;