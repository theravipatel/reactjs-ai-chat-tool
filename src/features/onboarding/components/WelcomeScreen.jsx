import { useState } from 'react';
import { useOnboarding } from '../hooks/useOnboarding';

function WelcomeScreen({ onSetupComplete }) {
    const [showSetup, setShowSetup] = useState(false);

    const {
        isSavingSetup,
        setupError,
        setSetupError,
        handleSubmit,
    } = useOnboarding(onSetupComplete);

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-900 px-6 text-zinc-100">
            <div className="w-full max-w-lg text-center">
                <div className="mb-6 text-5xl" aria-hidden="true">
                    ✦
                </div>

                <h1 className="mb-4 text-4xl font-semibold tracking-tight">
                    Welcome to AI Chat
                </h1>

                <p className="mb-8 text-base leading-7 text-zinc-400">
                    A simple space to explore ideas, ask questions,
                    and get help with your everyday tasks.
                </p>

                <button
                    type="button"
                    onClick={() => setShowSetup(true)}
                    className="rounded-xl bg-white px-6 py-3 font-medium text-zinc-900 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                    Get Started
                </button>
            </div>

            {
                showSetup && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                        onClick={(event) => {
                            if (event.target === event.currentTarget && !isSavingSetup) {
                                setShowSetup(false);
                                setSetupError('');
                            }
                        }}
                    >
                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="setup-title"
                            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-800 p-6 text-left shadow-2xl"
                        >
                            <h2
                                id="setup-title"
                                className="mb-2 text-2xl font-semibold"
                            >
                                Set up your chat
                            </h2>

                            <p className="mb-6 text-sm leading-6 text-zinc-400">
                                Enter your display name and Gemini API key
                                to get started.
                            </p>

                            <form onSubmit={handleSubmit}>
                                {setupError && (
                                    <p role="alert" className="mb-4 text-sm text-red-400">
                                        {setupError}
                                    </p>
                                )}

                                <label
                                    htmlFor="display-name"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Display name
                                </label>

                                <input
                                    id="display-name"
                                    name="displayName"
                                    type="text"
                                    autoComplete="nickname"
                                    required
                                    maxLength={50}
                                    placeholder="What should we call you?"
                                    disabled={isSavingSetup}
                                    className="mb-5 w-full rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500"
                                />

                                <label
                                    htmlFor="gemini-api-key"
                                    className="mb-2 block text-sm font-medium"
                                >
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
                                    className="mb-6 w-full rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500"
                                />

                                <button
                                    type="submit"
                                    disabled={isSavingSetup}
                                    className="w-full rounded-xl bg-white px-4 py-3 font-medium text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSavingSetup ? 'Validating...' : 'Save and continue'}
                                </button>

                                <button
                                    type="button"
                                    disabled={isSavingSetup}
                                    onClick={() => {
                                        setShowSetup(false);
                                        setSetupError('');
                                    }}
                                    className="mt-3 w-full rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-700 hover:text-white disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                            </form>
                        </section>
                    </div>
                )
            }
        </main>
    );
}

export default WelcomeScreen;