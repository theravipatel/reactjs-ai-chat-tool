import './App.css';
import { useEffect, useRef, useState } from 'react';
import { useChat } from './features/chat/hooks/useChat';
import MessageList from './features/chat/components/MessageList';
import ChatSidebar from './features/chat/components/ChatSidebar';
import ChatInput from './features/chat/components/ChatInput';
import WelcomeScreen from './features/onboarding/components/WelcomeScreen';

function App() {
    const [isSetupComplete, setIsSetupComplete] = useState(
        () =>
            Boolean(
                localStorage.getItem('gemini_api_key')?.trim() &&
                localStorage.getItem('display_name')?.trim()
            )
    );

    const {
        chatHistory,
        activeSessionId,
        isLoading,
        chatSessions,
        handleNewChat,
        handleSelectSession,
        sendChatMessage,
    } = useChat();

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

    if (!isSetupComplete) {
        return (
            <WelcomeScreen
                onSetupComplete={() => setIsSetupComplete(true)}
            />
        );
    }

    return (
        <div className='grid grid-cols-5 h-screen w-screen overflow-hidden bg-zinc-900'>
            {/* Left Section */}
            <ChatSidebar
                chatSessions={chatSessions}
                activeSessionId={activeSessionId}
                isLoading={isLoading}
                onNewChat={handleNewChat}
                onSelectSession={handleSelectSession}
            />
            {/* Left Section */}
            {/* Right Section */}
            <main className='col-span-5 md:col-span-4 flex flex-col h-full overflow-hidden relative'>
                <section
                    aria-label="Chat conversation"
                    className='flex-1 overflow-y-auto p-6 scrollbar-thin'
                    ref={chatContainerRef}
                >
                    <MessageList
                        messages={chatHistory}
                        isLoading={isLoading}
                    />
                </section>
 
                <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-zinc-900 via-zinc-900 via-80% to-transparent pt-6 pb-6 px-6'>
                    <ChatInput
                        isLoading={isLoading}
                        onSendMessage={sendChatMessage}
                    />
                </div>
            </main>
            {/* Right Section */}
        </div>
    )
}

export default App
