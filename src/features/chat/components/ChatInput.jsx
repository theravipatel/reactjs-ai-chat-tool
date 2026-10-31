import { useEffect, useRef, useState } from 'react';
import { GEMINI_MODELS } from '../services/geminiService';

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const IMAGE_MIME_TYPES = {
    'image/png': ['png'],
    'image/jpeg': ['jpg', 'jpeg'],
    'image/webp': ['webp'],
    'image/heic': ['heic'],
    'image/heif': ['heif'],
};

function getImageMimeType(file) {
    const mimeType = file.type.toLowerCase();

    if (IMAGE_MIME_TYPES[mimeType]) return mimeType;

    const extension = file.name.split('.').pop()?.toLowerCase();
    return Object.entries(IMAGE_MIME_TYPES).find(([, extensions]) =>
        extensions.includes(extension)
    )?.[0];
}

function ChatInput({ isLoading, onSendMessage }) {
    const [inputMessage, setInputMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [attachmentError, setAttachmentError] = useState('');
    const [previewFailed, setPreviewFailed] = useState(false);
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(() => {
        const savedModel = localStorage.getItem('gemini_model');
        return GEMINI_MODELS.some((model) => model.id === savedModel)
            ? savedModel
            : GEMINI_MODELS[0].id;
    });
    const fileInputRef = useRef(null);
    const menuContainerRef = useRef(null);
    const selectedModelLabel = GEMINI_MODELS.find(
        (model) => model.id === selectedModel
    )?.label ?? GEMINI_MODELS[0].label;

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!menuContainerRef.current?.contains(event.target)) {
                setIsAttachmentMenuOpen(false);
                setIsModelMenuOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsAttachmentMenuOpen(false);
                setIsModelMenuOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const message = inputMessage.trim();

        if ((!message && !attachment) || isLoading) return;

        setInputMessage('');
        setAttachment(null);
        setAttachmentError('');
        setIsAttachmentMenuOpen(false);
        setIsModelMenuOpen(false);
        void onSendMessage(message, attachment, selectedModel);
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        const mimeType = getImageMimeType(file);

        if (!mimeType) {
            setAttachmentError('Choose a PNG, JPEG, WebP, HEIC, or HEIF image.');
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            setAttachmentError('Images must be 2 MiB or smaller.');
            return;
        }

        setAttachmentError('');
        setPreviewFailed(false);

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                setAttachmentError('This image could not be read.');
                return;
            }

            const base64Data = reader.result.split(',')[1];

            if (!base64Data) {
                setAttachmentError('This image could not be read.');
                return;
            }

            setAttachment({
                name: file.name,
                mimeType,
                data: base64Data,
                previewUrl: `data:${mimeType};base64,${base64Data}`,
            });
        };
        reader.onerror = () => {
            setAttachmentError('This image could not be read.');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className='mx-auto w-full max-w-2xl'>
            {attachment && (
                <div className='mb-3 flex w-fit max-w-full items-start gap-3 rounded-2xl border border-zinc-700 bg-zinc-800 p-2.5 shadow-lg'>
                    {previewFailed || attachment.mimeType === 'image/heic' || attachment.mimeType === 'image/heif' ? (
                        <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-xs text-zinc-400'>
                            Image
                        </div>
                    ) : (
                        <img
                            src={attachment.previewUrl}
                            alt={`Selected image: ${attachment.name}`}
                            onError={() => setPreviewFailed(true)}
                            className='h-16 w-16 shrink-0 rounded-xl object-cover'
                        />
                    )}
                    <div className='min-w-0 pt-1'>
                        <p className='max-w-48 truncate text-sm text-zinc-200'>
                            {attachment.name}
                        </p>
                        <p className='text-xs text-zinc-500'>Image attached</p>
                    </div>
                    <button
                        type='button'
                        aria-label='Remove attached image'
                        title='Remove image'
                        disabled={isLoading}
                        onClick={() => {
                            setAttachment(null);
                            setAttachmentError('');
                            setPreviewFailed(false);
                        }}
                        className='inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg leading-none text-zinc-400 hover:bg-zinc-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        ×
                    </button>
                </div>
            )}

            <form
                className='flex h-14 w-full items-center rounded-full border border-zinc-700 bg-zinc-800 pl-5 pr-3 shadow-2xl transition-all focus-within:border-pink-500 sm:pr-4'
                onSubmit={handleFormSubmit}
            >
                <input
                    type='text'
                    aria-label='Message to the AI'
                    disabled={isLoading}
                    className='h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-50'
                    placeholder='Ask me anything...'
                    onChange={(event) => setInputMessage(event.target.value)}
                    value={inputMessage}
                />

                <button
                    type='submit'
                    disabled={isLoading || (!inputMessage.trim() && !attachment)}
                    className='ml-3 inline-flex h-9 min-w-18 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-pink-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300 disabled:hover:bg-zinc-700'
                >
                    Ask
                    <span aria-hidden='true' className='text-base leading-none'>
                        ↑
                    </span>
                </button>
            </form>

            {
                attachmentError && (
                    <p role='alert' className='mt-2 px-3 text-xs text-red-400'>
                        {attachmentError}
                    </p>
                )
            }

            <div ref={menuContainerRef} className='mt-2 flex items-center justify-between gap-2 px-2'>
                <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/png,image/jpeg,image/webp,image/heic,image/heif,.heic,.heif'
                    className='sr-only'
                    aria-label='Choose an image'
                    disabled={isLoading}
                    onChange={handleFileChange}
                />

                <div className='relative'>
                    <button
                        type='button'
                        aria-label='Add an image'
                        aria-haspopup='true'
                        aria-expanded={isAttachmentMenuOpen}
                        disabled={isLoading}
                        onClick={() => {
                            setIsAttachmentMenuOpen((isOpen) => !isOpen);
                            setIsModelMenuOpen(false);
                        }}
                        className='inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full p-0 text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <svg
                            aria-hidden='true'
                            viewBox='0 0 24 24'
                            fill='none'
                            className='h-5 w-5 shrink-0'
                        >
                            <path
                                d='M12 5v14M5 12h14'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                            />
                        </svg>
                    </button>
                    {
                        isAttachmentMenuOpen && (
                            <div className='absolute bottom-full left-0 z-20 mb-2 w-44 rounded-xl border border-zinc-700 bg-zinc-800 p-1.5 shadow-xl'>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setIsAttachmentMenuOpen(false);
                                        fileInputRef.current?.click();
                                    }}
                                    className='flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-zinc-200 transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300'
                                >
                                    <span aria-hidden='true'>▧</span>
                                    Upload image
                                </button>
                            </div>
                        )
                    }
                </div>

                <p className='hidden min-w-0 flex-1 truncate text-center text-xs text-zinc-500 sm:block'>
                    AI can make mistakes. Check important information.
                </p>

                <div className='relative'>
                    <button
                        type='button'
                        aria-label={`Select Gemini model. Current model: ${selectedModelLabel}`}
                        aria-haspopup='true'
                        aria-expanded={isModelMenuOpen}
                        disabled={isLoading}
                        onClick={() => {
                            setIsModelMenuOpen((isOpen) => !isOpen);
                            setIsAttachmentMenuOpen(false);
                        }}
                        className='inline-flex h-9 max-w-48 cursor-pointer items-center gap-2 rounded-full px-3 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <span className='truncate'>{selectedModelLabel}</span>
                        <span aria-hidden='true' className='text-[10px] text-zinc-500'>⌄</span>
                    </button>
                    {isModelMenuOpen && (
                        <div className='absolute bottom-full right-0 z-20 mb-2 w-56 rounded-xl border border-zinc-700 bg-zinc-800 p-1.5 shadow-xl'>
                            {GEMINI_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    type='button'
                                    aria-current={selectedModel === model.id ? 'true' : undefined}
                                    onClick={() => {
                                        setSelectedModel(model.id);
                                        setIsModelMenuOpen(false);
                                        try {
                                            localStorage.setItem('gemini_model', model.id);
                                        } catch (error) {
                                            console.warn('Could not save the selected Gemini model:', error);
                                        }
                                    }}
                                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
                                        selectedModel === model.id
                                            ? 'bg-zinc-700 text-white'
                                            : 'text-zinc-300 hover:bg-zinc-700/70 hover:text-white'
                                    }`}
                                >
                                    {model.label}
                                    {selectedModel === model.id && (
                                        <span aria-hidden='true' className='text-pink-300'>✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatInput;