import { useState } from 'react';

function ChatInput({ isLoading, onSendMessage }) {
    const [inputMessage, setInputMessage] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const message = inputMessage.trim();

        if (!message || isLoading) return;

        setInputMessage('');
        void onSendMessage(message);
    };

    return (
        <>
            <p className='mx-auto mb-2 max-w-2xl px-3 text-center text-xs leading-4 text-zinc-500'>
                AI can make mistakes. Check important information.
            </p>
            <form
                className='w-full max-w-2xl mx-auto h-14 flex items-center rounded-full bg-zinc-800 border border-zinc-700 pl-5 pr-6 focus-within:border-pink-500 shadow-2xl transition-all'
                onSubmit={handleFormSubmit}
            >
                <input
                    type='text'
                    aria-label='Message to the AI'
                    disabled={isLoading}
                    className='flex-1 h-full bg-transparent outline-none text-white placeholder:text-zinc-500 text-sm disabled:opacity-50'
                    placeholder='Ask me anything...'
                    onChange={(event) => setInputMessage(event.target.value)}
                    value={inputMessage}
                />

                <button
                    type='submit'
                    disabled={isLoading || !inputMessage.trim()}
                    className='ml-3 inline-flex h-9 min-w-18 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-pink-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300 disabled:hover:bg-zinc-700'
                >
                    Ask
                    <span aria-hidden='true' className='text-base leading-none'>
                        ↑
                    </span>
                </button>
            </form>
        </>
    );
}

export default ChatInput;