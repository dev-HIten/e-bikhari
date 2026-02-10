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

    const toggleMute = () => {
        if (iframeRef.current) {
            const command = isMuted ? 'unMute' : 'mute'; // Toggle logic
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: command,
                args: []
            }), '*');
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative h-[85vh] w-full flex items-end justify-start pb-20 overflow-hidden group bg-black pl-4 md:pl-16">
            {/* Immersive Background with Parallax */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                {/* 1. Base Poster (Always rendered) */}
                <img
                    src={`${BACKDROP_BASE}${item.backdrop_path}`}
                    alt={item.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
                    fetchPriority="high"
                />

                {/* 2. YouTube Video Background */}
                <AnimatePresence>
                    {showVideo && trailerKey && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-full h-full pointer-events-none scale-125" // Scale to hide UI
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

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            </motion.div>

            {/* Content - Left Aligned */}
            <div className="relative z-10 text-left max-w-4xl space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <span className="inline-block py-1.5 px-4 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md text-[10px] md:text-xs font-bold text-yellow-400 mb-4 md:mb-6 tracking-widest uppercase shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                        ★ Spotlight Selection
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-normal text-white drop-shadow-2xl mb-4 leading-tight md:leading-[1.1]">
                        {item.title || item.name}
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl text-white/80 max-w-2xl line-clamp-3 md:line-clamp-2 leading-relaxed">
                        {item.overview}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                    className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2"
                >
                    <button
                        onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
                        className="w-full sm:w-auto px-8 py-3 md:py-4 bg-white text-black rounded-full font-bold text-base md:text-lg hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Play Now
                    </button>
                    {/* Add to List Button (Mobile Friendly) */}
                    <button
                        className={`w-full sm:w-auto px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-colors backdrop-blur-md flex items-center justify-center gap-2 ${inList
                            ? 'bg-white/20 text-white border border-white/20'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-transparent'
                            }`}
                        onClick={() => inList ? removeFromWatchlist(item.id) : addToWatchlist(item)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {inList
                                ? <polyline points="20 6 9 17 4 12" /> // Smoother Checkmark
                                : <path d="M12 5v14M5 12h14" /> // Plus
                            }
                        </svg>
                        <span>{inList ? 'Added' : 'My List'}</span>
                    </button>
                </motion.div>
            </div>

            {/* Mute/Unmute Control (Bottom Right) */}
            {showVideo && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-8 right-8 z-20 hidden md:block" // Hidden on mobile to avoid covering content
                >
                    <button
                        onClick={toggleMute}
                        className="w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        )}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default SpotlightHero;
