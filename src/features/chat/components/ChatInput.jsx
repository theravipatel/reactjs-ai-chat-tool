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
                className='ml-3 cursor-pointer text-sm font-semibold text-white hover:text-pink-400 disabled:opacity-30 disabled:hover:text-white active:scale-95 transition-transform'
            >
                Ask
            </button>
        </form>
    );
}

export default ChatInput;