import { useEffect, useRef, useState } from 'react';
import { useOnboarding } from '../hooks/useOnboarding';

const conversationStarters = [
    {
        label: 'Ask a question',
        prompt: 'I have a question. Can you help me understand it?',
    },
    {
        label: 'Explain a topic',
        prompt: 'Explain this topic in simple, clear language.',
    },
    {
        label: 'Help me write',
        prompt: 'Help me write a clear message about...',
    },
];

function WelcomeScreen({ onSetupComplete }) {
    const [selectedStarter, setSelectedStarter] = useState(0);
    const [showSetup, setShowSetup] = useState(false);
    const dialogRef = useRef(null);

    const {
        isSavingSetup,
        setupError,
        setSetupError,
        handleSubmit,
    } = useOnboarding(onSetupComplete);

    useEffect(() => {
        if (showSetup && dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, [showSetup]);

    const closeSetup = () => {
        if (isSavingSetup) return;

        setShowSetup(false);
        setSetupError('');
    };

    return (
        <main className="welcome-shell flex min-h-screen flex-col px-5 text-zinc-100 sm:px-8">
            <header className="welcome-enter mx-auto flex w-full max-w-6xl items-center justify-between border-b border-zinc-800/80 py-5">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10 text-xl text-pink-400" aria-hidden="true">
                        ✦
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-zinc-100">
                        AI Chat
                    </span>
                </div>
                <span className="text-xs text-zinc-500">Simple chat, powered by Gemini</span>
            </header>

            <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center py-12 sm:py-16">
                <div className="welcome-enter max-w-3xl">
                    <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
                        Welcome to AI Chat
                    </h1>

                    <p className="mt-3 max-w-xl text-base leading-7 text-zinc-400">
                        Ask questions or get help with everyday tasks.
                    </p>
                </div>

                <div className="welcome-enter welcome-enter-delay mt-8 w-full max-w-3xl">
                    <p className="mb-3 text-sm font-medium text-zinc-400">
                        Try an example
                    </p>
                    <div className="flex flex-wrap gap-2" aria-label="Conversation starters">
                        {conversationStarters.map((starter, index) => (
                            <button
                                key={starter.label}
                                type="button"
                                aria-pressed={selectedStarter === index}
                                onClick={() => setSelectedStarter(index)}
                                className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${
                                    selectedStarter === index
                                        ? 'border-pink-500/60 bg-pink-500/10 text-pink-200'
                                        : 'border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                                }`}
                            >
                                {starter.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 flex min-h-28 flex-col justify-between border-y border-zinc-800 py-4 sm:flex-row sm:items-center sm:gap-8">
                        <div>
                            <p className="mb-2 text-xs font-medium text-zinc-500">
                                Example message
                            </p>
                            <p
                                key={selectedStarter}
                                aria-live="polite"
                                className="welcome-prompt-update max-w-xl text-sm leading-6 text-zinc-200 sm:text-base"
                            >
                                “{conversationStarters[selectedStarter].prompt}”
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={() => {
                                setSetupError('');
                                setShowSetup(true);
                            }}
                            className="cursor-pointer rounded-full border border-pink-500 bg-pink-600 px-7 py-3 font-medium text-white transition hover:border-pink-400 hover:bg-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                        >
                            Get Started
                            <span className="ml-3" aria-hidden="true">→</span>
                        </button>
                        <p className="text-xs text-zinc-500">
                            Connect your Gemini API key to start chatting.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="welcome-enter mx-auto flex w-full max-w-6xl items-center justify-between border-t border-zinc-800/80 py-4 text-xs text-zinc-500">
                <span>AI Chat</span>
                <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-6">
                    <p>
                        Source code is available on{' '}
                        <a
                            href="https://github.com/theravipatel/reactjs-ai-chat-tool"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded bg-pink-500/10 px-1.5 py-1 font-medium text-pink-300 underline decoration-pink-500/50 underline-offset-2 transition hover:bg-pink-500/20 hover:text-pink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                        >
                            GitHub
                        </a>
                    </p>
                    <p>
                        Developed by{' '}
                        <a
                            href="https://www.linkedin.com/in/ravipatelofficial/"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded bg-pink-500/10 px-1.5 py-1 font-medium text-pink-300 underline decoration-pink-500/50 underline-offset-2 transition hover:bg-pink-500/20 hover:text-pink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                        >
                            Ravi Patel
                        </a>
                    </p>
                </div>
            </footer>

            {showSetup && (
                <dialog
                    ref={dialogRef}
                    aria-labelledby="setup-title"
                    onCancel={(event) => {
                        event.preventDefault();
                        closeSetup();
                    }}
                    onClick={(event) => {
                        if (event.target === event.currentTarget) closeSetup();
                    }}
                    className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-left text-zinc-100 shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:p-8"
                >
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h2 id="setup-title" className="text-2xl font-semibold">
                                Chat setup
                            </h2>
                        </div>
                        <button
                            type="button"
                            aria-label="Close setup"
                            onClick={closeSetup}
                            disabled={isSavingSetup}
                            className="cursor-pointer rounded-full px-2 text-2xl leading-none text-zinc-500 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            ×
                        </button>
                    </div>

                    <p className="mb-6 text-sm leading-6 text-zinc-400">
                        Add a display name and connect your Gemini API key. Both are saved in this browser.
                    </p>

                    <form onSubmit={handleSubmit}>
                        {setupError && (
                            <p role="alert" className="mb-4 text-sm text-red-400">
                                {setupError}
                            </p>
                        )}

                        <label htmlFor="display-name" className="mb-2 block text-sm font-medium">
                            Display name
                        </label>
                        <input
                            id="display-name"
                            name="displayName"
                            type="text"
                            autoComplete="nickname"
                            autoFocus
                            required
                            maxLength={50}
                            placeholder="What should we call you?"
                            disabled={isSavingSetup}
                            className="mb-5 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                        />

                        <label htmlFor="gemini-api-key" className="mb-2 block text-sm font-medium">
                            Gemini API key
                        </label>
                        <input
                            id="gemini-api-key"
                            name="apiKey"
                            type="password"
                            autoComplete="off"
                            required
                            placeholder="Paste your API key"
                            disabled={isSavingSetup}
                            className="mb-6 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                        />

                        <button
                            type="submit"
                            disabled={isSavingSetup}
                            className="w-full cursor-pointer rounded-full border border-pink-500 bg-pink-600 px-4 py-3 font-medium text-white transition hover:border-pink-400 hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSavingSetup ? 'Validating...' : 'Save and start chatting'}
                        </button>
                    </form>
                </dialog>
            )}
        </main>
    );
}

export default WelcomeScreen;