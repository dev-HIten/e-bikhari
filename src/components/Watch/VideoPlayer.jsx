import { useEffect } from 'react';

const VideoPlayer = ({ embedUrl, onCancel }) => {
    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    return (
        <div className="w-full h-screen fixed inset-0 z-[60] bg-black flex flex-col transition-opacity duration-300">
            <div className="flex-1 relative">
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture"
                />
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors border border-white/5"
                    aria-label="Close Player (Esc)"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer;
