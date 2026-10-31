import Logo from './Logo';

function Header({ className }) {
    return (
        <header className={className}>
            <div className="flex items-center gap-3">
                <Logo />
                <span className="text-sm font-semibold tracking-wide text-zinc-100">
                    React AI Chat
                </span>
            </div>
            <span className="hidden text-right text-xs text-zinc-500 sm:block">
                Simple chat, powered by Gemini
            </span>
        </header>
    );
}

export default Header;