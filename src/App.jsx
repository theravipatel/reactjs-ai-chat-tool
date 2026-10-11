import { GoogleGenAI } from '@google/genai';
import './App.css'
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI({apiKey});

    const [inputMessage, setInputMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await ai.interactions.create({
                model: 'gemini-3.8-flash',
                input: inputMessage,
            });
            setResponseMessage(response.output_text);
        } catch (error) {
            setResponseMessage(error.message || "Network exception during API token execution.");
        }
        setInputMessage('');
    }

    return (
        <div className='grid grid-cols-5 h-screen w-screen overflow-hidden bg-zinc-900'>
            {/* Left Section */}
            <aside className='hidden md:block col-span-1 border-r border-zinc-800 bg-zinc-950'>
                <h3 className='flex items-center justify-between gap-2 text-xl text-white bg-zinc-700 p-3 border-b border-zinc-500'>
                    <span>Recent Searches</span>
                    <button
                        type='button'
                        aria-label='Clear recent searches'
                        className='cursor-pointer'
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'
                            stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
                            className='w-5 h-5'>
                            <path d='M3 6h18' />
                            <path d='M8 6V4h8v2' />
                            <path d='M6 6l1 14h10l1-14' />
                            <path d='M10 11v5M14 11v5' />
                        </svg>
                    </button>
                </h3>
 
                <ul className='mt-3 space-y-1 text-white list-disc list-inside'>
                    <li className='truncate text-sm text-zinc-300 hover:text-white cursor-pointer p-2 border-b border-zinc-700'>Test 1</li>
                    <li className='truncate text-sm text-zinc-300 hover:text-white cursor-pointer p-2 border-b border-zinc-700'>Test 1</li>
                    <li className='truncate text-sm text-zinc-300 hover:text-white cursor-pointer p-2 border-b border-zinc-700'>Test 1</li>
                </ul>
            </aside>
            {/* Left Section */}
            {/* Right Section */}
            <main className='col-span-5 md:col-span-4 flex flex-col h-full overflow-hidden relative'>
                <div className='flex-1 overflow-y-auto p-6 scrollbar-thin'>
                    <div className='max-w-3xl mx-auto w-full pt-4 pb-24 text-left'>
                        {
                            !responseMessage && 
                                <div className='h-[50vh] flex items-center justify-center'>
                                    <h1 className='text-4xl text-center font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                                        Hello User, Ask me Anything
                                    </h1>
                                </div>
                        }
                        {
                            responseMessage && (
                                <div className='text-zinc-100 max-w-none tracking-wide leading-relaxed'>
                                    <ReactMarkdown>{ responseMessage }</ReactMarkdown>
                                </div>
                            )
                        }
                    </div>
                </div>
 
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 via-zinc-900 via-80% to-transparent pt-6 pb-6 px-6'>
                    <form
                        className='w-full max-w-2xl mx-auto h-14 flex items-center rounded-full bg-zinc-800 border border-zinc-700 pl-5 pr-6 focus-within:border-pink-500 shadow-2xl transition-all'
                        onSubmit={handleFormSubmit}
                    >
                        <input
                            type='text'
                            className='flex-1 h-full bg-transparent outline-none text-white placeholder:text-zinc-500 text-sm'
                            placeholder='Ask me anything...'
                            onChange={(event) => setInputMessage(event.target.value)}
                            value={inputMessage}
                        />
                        <button
                            type='submit'
                            className='ml-3 cursor-pointer text-sm font-semibold text-white hover:text-pink-400 active:scale-95 transition-transform'
                        >
                            Ask
                        </button>
                    </form>
                </div>
            </main>
            {/* Right Section */}
        </div>
    )
}

export default App
