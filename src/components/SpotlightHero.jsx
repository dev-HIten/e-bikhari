import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BACKDROP_BASE, api } from '../services/api';
import { useState, useEffect, useRef } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';

const SpotlightHero = ({ item }) => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

    // Video State
    const [trailerKey, setTrailerKey] = useState(null);
    const [showVideo, setShowVideo] = useState(false);

    // Mute State (Moved up to fix Hook Error)
    const [isMuted, setIsMuted] = useState(true);
    const iframeRef = useRef(null);

    useEffect(() => {
        let timer;
        if (item) {
            // Reset state on item change
            setTrailerKey(null);
            setShowVideo(false);

            // Fetch Trailer
            const fetchTrailer = async () => {
                try {
                    const data = await api.getVideos(item.media_type || 'movie', item.id);
                    const trailer = data.results?.find(
                        vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
                    );
                    if (trailer) {
                        setTrailerKey(trailer.key);
                        // Delay showing video to allow poster to set mood
                        timer = setTimeout(() => setShowVideo(true), 2500);
                    }
                } catch (e) {
                    console.error("Failed to fetch trailer", e);
                }
            };
            fetchTrailer();
        }
        return () => clearTimeout(timer);
    }, [item]);

    if (!item) return null;
    const inList = isInWatchlist(item.id);

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
        <div className="relative h-[90vh] w-full bg-[#0B0C0E] overflow-hidden group">
            {/* Layer 1: Base (Video/Image) - z-0 */}
            <motion.div
                style={{ y, opacity }}
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
                <AnimatePresence>
                    {showVideo && trailerKey && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.35]" // Increased scale to remove black bars/controls
                        >
                            <iframe
                                ref={iframeRef}
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1`}
                                className="w-full h-full object-cover"
                                allow="autoplay; encrypted-media"
                                title="Hero Trailer"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Layer 2: The Vignette & Ambient Glow - z-1 */}
            <div className="absolute inset-0 z-1 pointer-events-none">
                {/* 1. Global Gradient (Top/Bottom Fade) */}
                <div 
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to top, #0B0C0E 10%, rgba(11,12,14,0.6) 50%, transparent 100%)'
                    }}
                />
                
                {/* 2. Ambient Glow (Jungle Green / Warm Orange) - "Ambilight" Effect */}
                <div 
                    className="absolute inset-0 mix-blend-screen opacity-60"
                    style={{
                        background: 'radial-gradient(circle at 20% 90%, rgba(50, 168, 82, 0.25), transparent 60%)' // Jungle Green tint
                    }}
                />
                 {/* 3. Bottom Fade to Black (Seamless transition) */}
                 <div 
                    className="absolute bottom-0 left-0 right-0 h-[50vh]"
                    style={{
                         background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)'
                    }}
                 />
            </div>

            {/* Layer 3: Content - z-10 */}
            <div className="absolute z-10 bottom-[15%] left-[4%] w-full max-w-screen-2xl pr-8 pl-4 md:pl-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="max-w-4xl"
                >
                    {/* Tag / Badge */}
                    <div className="flex items-center gap-3 mb-6">
                         <span className="flex items-center gap-1.5 bg-[#FFD700] text-black text-[10px] md:text-xs font-extrabold px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-lg">
                            <span className="text-xs">TOP</span> 10
                         </span>
                         <span className="text-white/90 font-bold text-xs md:text-sm tracking-widest uppercase drop-shadow-md flex items-center gap-2">
                             <span className="w-1 h-1 bg-white rounded-full"></span>
                             #1 in Movies Today
                         </span>
                    </div>

                    {/* Title */}
                    <h1 
                        className="text-5xl md:text-[4rem] lg:text-[5.5rem] font-black leading-[1.0] tracking-tighter text-white mb-6 drop-shadow-2xl"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif" }} // Ensuring imposition
                    >
                        {item.title || item.name}
                    </h1>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90 text-sm md:text-base font-medium mb-6 drop-shadow-lg">
                        <span className="text-[#46d369] font-bold">98% Match</span>
                        <span>{(item.release_date || item.first_air_date || '').substring(0, 4)}</span>
                        <span className="border border-white/40 bg-white/10 px-1.5 py-0.5 rounded-[4px] text-[10px] md:text-xs tracking-wide">4K</span>
                        <span className="border border-white/40 bg-white/10 px-1.5 py-0.5 rounded-[4px] text-[10px] md:text-xs tracking-wide">DOLBY ATMOS</span>
                        <span>{item.media_type === 'tv' ? '3 Seasons' : '2h 14m'}</span>
                        <span className="hidden md:inline-block w-1 h-1 bg-white/50 rounded-full"></span>
                        <span className="text-white/80">Thriller • Sci-Fi • Drama</span>
                    </div>

                    {/* Description */}
                    <p className="text-white/95 text-base md:text-lg lg:text-xl leading-relaxed max-w-full md:max-w-[60%] lg:max-w-[50%] drop-shadow-lg line-clamp-3 md:line-clamp-4 mb-8 font-light text-shadow-sm">
                        {item.overview}
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
                            className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Play
                        </button>
                    </div>
                </motion.div>
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
