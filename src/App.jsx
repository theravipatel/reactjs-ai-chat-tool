import { GoogleGenAI } from '@google/genai';
import './App.css'
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI({apiKey});

    // User input
    const [inputMessage, setInputMessage] = useState('');

    // Client-side UI array for rendering message
    const [chatHistory, setChatHistory] = useState([]);

    // Tracking the server-side conversation ID state thread
    const [interactionId, setInteractionId] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    // Maintain session arrays inside local state
    const [sessions, setSessions] = useState([]);

    const chatContainerRef = useRef(null);
    // Dynamic auto-scrolling to the bottom layout line
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chatHistory, isLoading]);

    // Fetch recent interations from local storage
    useEffect(() => {
        const savedSessions = localStorage.getItem('chat_sessions');
        if (savedSessions) {
            const parsedSessions = JSON.parse(savedSessions);
            setSessions(parsedSessions);
        }
    }, []);

    const handleNewChat = () => {
        setChatHistory([]);
        setInteractionId(null);
    };

    const handleSelectSession = (session) => {
        setChatHistory(session.history);
        setInteractionId(session.id);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const userPrompt = inputMessage.trim();
        if (!userPrompt || isLoading) return;

        const currentActiveId = interactionId;
        const updatedHistory = [...chatHistory, { role: 'user', text: userPrompt }];

        // Append user prompt straight to the client history tracking state
        setChatHistory(updatedHistory);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await ai.interactions.create({
                model: 'gemini-3.8-flash',
                input: userPrompt,
                // Link turn to previous conversation node if one exists
                previous_interaction_id: currentActiveId || undefined, 
            });

            const nextInteractionId = response.id;
            setInteractionId(nextInteractionId);

            // Extract text correctly from .output_text and update server state tracking ID
            const finalHistory = [...updatedHistory, { role: 'model', text: response.output_text }];

            // Append ai prompt straight to the client history tracking state
            setChatHistory(finalHistory);

            // Update and save chat sessions
            setSessions(prevSessions => {
                const firstUserMsg = finalHistory.find(msg => msg.role === 'user')?.text || userPrompt;
                const sessionTitle = firstUserMsg;

                let nextSessions;
                if (!currentActiveId) {
                    // Current Chat: Add new entry to the top of the list
                    nextSessions = [{
                        id: nextInteractionId,
                        title: sessionTitle,
                        history: finalHistory
                    }, ...prevSessions];
                } else {
                    // Other Chats: Replace matching ID nodes to update historical tracking arrays
                    nextSessions = prevSessions.map(session => 
                        session.id === currentActiveId 
                            ? { ...session, id: nextInteractionId, history: finalHistory }
                            : session
                    );
                }

                // Persist the array update to the browser's persistent storage engine
                localStorage.setItem('chat_sessions', JSON.stringify(nextSessions));
                return nextSessions;
            });
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'model', text: error.message || "Network exception during API execution." }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='grid grid-cols-5 h-screen w-screen overflow-hidden bg-zinc-900'>
            {/* Left Section */}
            <div className='hidden md:flex flex-col col-span-1 border-r border-zinc-800 bg-zinc-950 p-2 h-full overflow-hidden'>
                <button 
                    onClick={handleNewChat}
                    className='w-full py-2.5 px-4 mb-6 rounded-full border border-zinc-700 text-zinc-200 text-xs font-medium hover:bg-zinc-800 hover:border-pink-500 transition-all cursor-pointer text-center'
                >
                    + New Chat
                </button>

                <div className='text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2 border-b border-zinc-700 pb-2'>
                    Recent Chats
                </div>

                <div className='flex-1 overflow-y-auto space-y-1'>
                    {
                        sessions.length === 0 && (
                            <div className='text-xs text-zinc-600 italic px-2 mt-2'>No recent sessions</div>
                        )
                    }
                    {
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => handleSelectSession(session)}
                                className={`w-full text-left p-2 rounded-xl text-xs truncate font-medium transition-all cursor-pointer block ${
                                    interactionId === session.id 
                                        ? 'bg-zinc-800 border-l-2 border-pink-500 text-white shadow-md' 
                                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                                }`}
                                title={session.title}
                            >
                                💬 { session.title.length > 50 ? session.title.substring(0, 50) + "..." : session.title }
                            </button>
                        ))
                    }
                </div>
            </div>
            {/* Left Section */}
            {/* Right Section */}
            <main className='col-span-5 md:col-span-4 flex flex-col h-full overflow-hidden relative'>
                <div
                    className='flex-1 overflow-y-auto p-6 scrollbar-thin'
                    ref={chatContainerRef}
                >
                    <div className='max-w-3xl mx-auto w-full pt-4 pb-24 text-left'>
                        {
                            chatHistory.length === 0 && 
                                <div className='h-[50vh] flex items-center justify-center'>
                                    <h1 className='text-4xl text-center font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
                                        Hello User, Ask me Anything
                                    </h1>
                                </div>
                        }
                        <div className="space-y-6">
                            {
                                chatHistory.map((msg, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className='text-xs font-semibold mb-1 text-zinc-500 uppercase tracking-wider'>
                                            {msg.role === 'user' ? 'You' : 'AI'}
                                        </div>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 tracking-wide leading-relaxed text-zinc-100 ${
                                            msg.role === 'user' 
                                                ? 'bg-zinc-800 border border-zinc-700 rounded-tr-none' 
                                                : 'bg-transparent max-w-none w-full px-0'
                                        }`}>
                                            <ReactMarkdown>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))
                            }

                            {
                                isLoading && (
                                    <div className="flex flex-col items-start animate-pulse">
                                        <div className="text-xs font-semibold mb-1 text-zinc-500 uppercase tracking-wider">AI</div>
                                        <div className="text-sm text-zinc-400 italic">Thinking...</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
 
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 via-zinc-900 via-80% to-transparent pt-6 pb-6 px-6'>
                    <form
                        className='w-full max-w-2xl mx-auto h-14 flex items-center rounded-full bg-zinc-800 border border-zinc-700 pl-5 pr-6 focus-within:border-pink-500 shadow-2xl transition-all'
                        onSubmit={handleFormSubmit}
                    >
                        <input
                            type='text'
                            disabled={isLoading}
                            className='flex-1 h-full bg-transparent outline-none text-white placeholder:text-zinc-500 text-sm disabled:opacity-50'
                            placeholder={isLoading ? 'AI is evaluating prompt...' : 'Ask me anything...'}
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
                </div>
            </main>
            {/* Right Section */}
        </div>
    )
}

export default App
