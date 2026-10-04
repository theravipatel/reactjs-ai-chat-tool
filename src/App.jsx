import './App.css'

function App() {
    return (
        <div className='grid grid-cols-5 h-screen'>
            {/* Left Section */}
            <aside className='col-span-1 bg-zinc-800 overflow-y-auto'>
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
            <main className='col-span-4 bg-zinc-900 flex flex-col p-6'>
                <div className='flex-1 text-center pt-4'>
                    <h1 className='text-4xl bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent h-16'>
                        Hello User, Ask me Anything
                    </h1>
                </div>
 
                <div className='w-1/2 min-w-80 mx-auto mb-4 h-16 flex items-center rounded-full bg-zinc-800 border border-zinc-600 pl-5 pr-6'>
                    <input
                        type='text'
                        className='flex-1 h-full bg-transparent outline-none text-white placeholder:text-zinc-400'
                        placeholder='Ask me anything'
                    />
                    <button
                        type='button'
                        className='ml-3 cursor-pointer text-white hover:text-pink-400'
                    >
                        Ask
                    </button>
                </div>
            </main>
            {/* Right Section */}
        </div>
    )
}

export default App
