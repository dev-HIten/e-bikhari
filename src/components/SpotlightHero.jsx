import { useNavigate } from 'react-router-dom';
import { BACKDROP_BASE, api } from '../services/api';
import { useState, useEffect, useRef } from 'react';

const SpotlightHero = ({ item }) => {
    const navigate = useNavigate();

    // Video State
    const [trailerKey, setTrailerKey] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [details, setDetails] = useState(null);

    // Mute State (Moved up to fix Hook Error)
    const [isMuted, setIsMuted] = useState(true);
    const iframeRef = useRef(null);

    useEffect(() => {
        let timer;
        if (item) {
            // Reset state on item change
            setTrailerKey(null);
            setShowVideo(false);
            setDetails(null);

            // Fetch Trailer and Details
            const fetchData = async () => {
                try {
                    const mediaType = item.media_type || 'movie';
                    
                    // Fetch videos and details in parallel for speed
                    const [videosData, detailsData] = await Promise.all([
                        api.getVideos(mediaType, item.id),
                        api.getDetails(mediaType, item.id)
                    ]);
                    
                    const trailer = videosData.results?.find(
                        vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
                    );
                    if (trailer) {
                        setTrailerKey(trailer.key);
                        // Delay showing video to allow poster to set mood
                        timer = setTimeout(() => setShowVideo(true), 2500);
                    }
                    
                    setDetails(detailsData);
                } catch (e) {
                    console.error("Failed to fetch data for SpotlightHero", e);
                }
            };
            fetchData();
        }
        return () => clearTimeout(timer);
    }, [item]);

    // --- Smart Playback Logic ---
    const sendCommand = (func) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: func,
                args: []
            }), '*');
        }
    };

    useEffect(() => {
        if (!trailerKey || !showVideo) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                sendCommand('pauseVideo');
            } else {
                // Only resume if within view
                if (window.scrollY < 500) sendCommand('playVideo');
            }
        };

        // Throttled Scroll Handler
        let lastRun = 0;
        const handleScroll = () => {
            const now = Date.now();
            if (now - lastRun < 200) return; // Run at most every 200ms
            lastRun = now;

            if (window.scrollY > 500) {
                sendCommand('pauseVideo');
            } else if (!document.hidden) {
                sendCommand('playVideo');
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("scroll", handleScroll, { passive: true }); // Passive listener for performance

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [trailerKey, showVideo]);

    const toggleMute = () => {
        const command = isMuted ? 'unMute' : 'mute';
        sendCommand(command);
        setIsMuted(!isMuted);
    };

    return (
        <div className="relative h-[85svh] md:h-[90vh] w-full bg-[#0B0C0E] overflow-hidden group">
            {/* Layer 1: Base (Video/Image) - z-0 */}
            <div
                className="absolute inset-0 z-0"
            >
                {/* Poster - Always rendered as fallback/loading */}
                <img
                    src={`${BACKDROP_BASE}${item.backdrop_path}`}
                    alt={item.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
                    fetchPriority="high"
                />

                {/* YouTube Video Background */}
                {showVideo && trailerKey && (
                    <div
                        className="absolute inset-0 w-full h-full pointer-events-none scale-[1.35] animate-fade-in" // Use simple css fade-in instead of framer
                    >
                        <iframe
                            ref={iframeRef}
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1`}
                            className="w-full h-full object-cover"
                            allow="autoplay; encrypted-media"
                            title="Hero Trailer"
                        />
                    </div>
                )}
            </div>

            {/* Layer 2: The Vignette & Ambient Glow - z-1 */}
            <div 
                className="absolute inset-0 z-1 pointer-events-none"
                style={{
                    background: `
                        linear-gradient(to bottom, transparent 0%, #0a0a0a 100%),
                        radial-gradient(circle at 20% 90%, rgba(50, 168, 82, 0.25), transparent 60%),
                        linear-gradient(to top, #0B0C0E 10%, rgba(11,12,14,0.6) 50%, transparent 100%)
                    `,
                    backgroundBlendMode: 'normal, screen, normal'
                }}
            />

            {/* Layer 3: Content - z-10 */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end pb-[25%] sm:pb-[15%] px-4 md:px-8">
                <div className="w-full max-w-[1800px] mx-auto">
                <div className="max-w-4xl animate-fade-in-up">
                    {/* Tag / Badge */}
                    <div className="flex items-center gap-3 mb-4">
                         <span className="flex items-center gap-1.5 bg-[#FFD700] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            <span>TOP 10</span>
                         </span>
                         <span className="text-white font-bold text-xs uppercase flex items-center gap-2">
                             #1 in Movies Today
                         </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-none tracking-tight text-white mb-2 md:mb-4">
                        {item.title || item.name}
                    </h1>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm font-medium mb-3 md:mb-4">
                        <span className="text-[#46d369]">98% Match</span>
                        <span>{(item.release_date || item.first_air_date || '').substring(0, 4)}</span>
                        {details?.runtime > 0 && <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
                        {details?.number_of_seasons > 0 && <span>{details.number_of_seasons} Seasons</span>}
                        <span>{details?.genres?.slice(0, 3).map(g => g.name).join(' • ')}</span>
                    </div>

                    {/* Description */}
                    <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-[100%] sm:max-w-[85%] md:max-w-[70%] line-clamp-3 sm:line-clamp-4 mb-4 md:mb-6">
                        {item.overview}
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
                            className="bg-white text-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 hover:bg-white/90 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Play
                        </button>
                    </div>
                </div>
            </div>
            </div>



            {/* Mute Control */}
            <div className="absolute bottom-8 right-8 z-50 hidden md:block">
                <button
                    onClick={toggleMute}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all"
                >
                    {isMuted ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                    ) : (
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SpotlightHero;
