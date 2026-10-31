import Logo from './Logo';

function Footer({ className }) {
    return (
        <footer className={className}>
            <span className="flex items-center gap-2">
                <Logo size="small" />
                React AI Chat
            </span>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6">
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
    );
}

export default Footer;