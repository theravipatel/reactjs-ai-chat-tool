import ReactMarkdown from 'react-markdown';
import Logo from '../../../shared/components/Logo';

function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div
            className={`flex flex-col ${
                isUser ? 'items-end' : 'items-start'
            }`}
        >
            {isUser ? (
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    You
                </div>
            ) : (
                <div role="img" aria-label="Assistant" className="mb-1">
                    <Logo size="small" />
                </div>
            )}

            <div
                className={`max-w-[85%] min-w-0 rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 ${
                    isUser
                        ? 'rounded-tr-none whitespace-pre-wrap wrap-break-word'
                        : 'rounded-tl-none'
                }`}
            >
                {isUser && message.image && (
                    <div className='mb-3'>
                        {message.image.mimeType === 'image/heic' || message.image.mimeType === 'image/heif' ? (
                            <div className='flex h-40 w-40 items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-400'>
                                {message.image.name}
                            </div>
                        ) : (
                            <img
                                src={`data:${message.image.mimeType};base64,${message.image.data}`}
                                alt={`Attached image: ${message.image.name}`}
                                className='max-h-64 max-w-full rounded-xl object-contain'
                                onError={(event) => {
                                    event.currentTarget.hidden = true;
                                }}
                            />
                        )}
                    </div>
                )}
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