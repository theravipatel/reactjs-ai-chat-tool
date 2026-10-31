function Logo({ size = 'medium' }) {
    const isSmall = size === 'small';
    const logoSize = isSmall ? 'size-7 rounded-lg' : 'size-9 rounded-xl';
    const bubbleSize = isSmall ? 'h-4 w-5 rounded' : 'h-5 w-6 rounded-md';
    const dotSize = isSmall ? 'size-0.5' : 'size-1';

    return (
        <span
            className={`flex shrink-0 items-center justify-center border border-pink-500/30 bg-pink-500/10 text-pink-400 ${logoSize}`}
            aria-hidden="true"
        >
            <span className={`flex items-center justify-center gap-0.5 border-2 border-current ${bubbleSize}`}>
                {[0, 1, 2].map((dot) => (
                    <span key={dot} className={`rounded-full bg-current ${dotSize}`} />
                ))}
            </span>
        </span>
    );
}

export default Logo;