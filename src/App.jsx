import './App.css';
import { useEffect, useRef, useState } from 'react';
import { useChat } from './features/chat/hooks/useChat';
import MessageList from './features/chat/components/MessageList';
import ChatSidebar from './features/chat/components/ChatSidebar';
import ChatInput from './features/chat/components/ChatInput';
import WelcomeScreen from './features/onboarding/components/WelcomeScreen';
import Footer from './shared/components/Footer';
import Header from './shared/components/Header';

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
        <div className='app-grid-background grid h-dvh w-full grid-cols-5 overflow-hidden'>
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
            <main className='col-span-5 flex h-full min-h-0 flex-col overflow-hidden md:col-span-4'>
                <Header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between border-b border-zinc-800 px-6 py-1" />
                <section
                    aria-label="Chat conversation"
                    className='min-h-0 flex-1 overflow-y-auto p-6 scrollbar-thin'
                    ref={chatContainerRef}
                >
                    <MessageList
                        messages={chatHistory}
                        isLoading={isLoading}
                    />
                </section>
 
                <div className='shrink-0 px-4 pt-3 pb-2 sm:px-6 sm:pt-4'>
                    <ChatInput
                        isLoading={isLoading}
                        onSendMessage={sendChatMessage}
                    />
                </div>
                <Footer className="mx-auto flex w-full max-w-6xl shrink-0 flex-col items-start justify-between gap-3 border-t border-zinc-800 px-4 py-1 text-xs text-zinc-500 sm:flex-row sm:items-center sm:px-6" />
            </main>
            {/* Right Section */}
        </div>
    )
}

export default App
