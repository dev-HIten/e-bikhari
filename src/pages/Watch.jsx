import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, BACKDROP_BASE, IMAGE_BASE } from '../services/api';
import { useState, useRef, useEffect } from 'react';
import MasonryGrid from '../components/MasonryGrid';

const Watch = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const containerRef = useRef(null);

    // Reset state on id change
    useEffect(() => {
        setSeason(1);
        setEpisode(1);
        setIsPlaying(false);
    }, [id, type]);

    // Fetch Details & Credits
    const { data: item, isLoading } = useQuery({
        queryKey: ['details', type, id],
        queryFn: () => api.getDetails(type, id)
    });

    // Fetch Credits
    const { data: credits } = useQuery({
        queryKey: ['credits', type, id],
        queryFn: () => api.getCredits(type, id)
    });

    // Fetch Season Details if TV
    const { data: seasonDetails } = useQuery({
        queryKey: ['season', id, season],
        queryFn: () => api.getSeasonDetails(id, season),
        enabled: type === 'tv' && !!id
    });

    if (isLoading) return <div className="h-screen w-full bg-[#0a0a0a] grid place-items-center text-white/20 animate-pulse">Vexo</div>;

    const embedUrl = type === 'tv'
        ? `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`
        : `https://www.vidking.net/embed/movie/${id}`;

    const cast = credits?.cast?.slice(0, 10) || [];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] text-white w-full overflow-hidden">

            {/* Immersive Background */}
            <div
                className={`fixed inset-0 z-0 transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110"
                    style={{ backgroundImage: `url(${BACKDROP_BASE}${item.backdrop_path})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-black/30" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <button
                    onClick={() => navigate('/')}
                    className="pointer-events-auto bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors group"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium text-sm">Back to Browse</span>
                </button>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 pt-[15vh] pb-32">

                {isPlaying ? (
                    // Video Player Mode
                    <div
                        className="w-full h-screen fixed inset-0 z-50 bg-black flex flex-col transition-opacity duration-300"
                    >
                        <div className="flex-1 relative">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full border-0"
                                allowFullScreen
                                allow="autoplay; encrypted-media; picture-in-picture"
                            />
                            <button
                                onClick={() => setIsPlaying(false)}
                                className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors border border-white/5"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    // Details Mode
                    <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-12 lg:gap-24 items-end min-h-[60vh]">

                        {/* Left: Info */}
                        <div
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <span className="inline-block px-3 py-1 rounded bg-white/10 backdrop-blur-md text-xs font-bold tracking-wider uppercase text-white/80 border border-white/5">
                                    {type === 'tv' ? 'TV Series' : 'Feature Film'}
                                </span>
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                                    {item.title || item.name}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-lg font-medium text-white/70">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#f5c518] text-2xl">★</span>
                                    <span className="text-white">{item.vote_average?.toFixed(1)}</span>
                                </div>
                                <span className="w-1.5 h-1.5 rounded bg-white/20" />
                                <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                                {/* Runtime Logic */}
                                {item.runtime > 0 && (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded bg-white/20" />
                                        <span>{Math.floor(item.runtime / 60)}h {item.runtime % 60}m</span>
                                    </>
                                )}
                            </div>

                            <p className="text-xl leading-relaxed text-white/80 max-w-2xl font-light">
                                {item.overview}
                            </p>

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => setIsPlaying(true)}
                                        className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-base flex items-center gap-2 hover:bg-white/90 transition-colors"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        Play {type === 'tv' ? `S${season} E${episode}` : 'Movie'}
                                    </button>
                                </div>

                                {/* TV Series Selection */}
                                {type === 'tv' && item?.seasons && (
                                    <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={season}
                                                onChange={(e) => setSeason(Number(e.target.value))}
                                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white/90 focus:outline-none focus:border-white/30 cursor-pointer"
                                            >
                                                {item.seasons.filter(s => s.season_number > 0).map(s => (
                                                    <option key={s.id} value={s.season_number}>
                                                        Season {s.season_number}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="text-sm text-white/50">
                                                {seasonDetails?.episodes?.length || 0} Episodes
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            {seasonDetails?.episodes?.map(ep => (
                                                <button
                                                    key={ep.id}
                                                    onClick={() => setEpisode(ep.episode_number)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left truncate ${
                                                        episode === ep.episode_number
                                                            ? 'bg-white text-black'
                                                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                                                    }`}
                                                    title={ep.name}
                                                >
                                                    {ep.episode_number}. {ep.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cast List */}
                            {cast.length > 0 && (
                                <div className="pt-8 border-t border-white/10">
                                    <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Starring</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {cast.map(c => (
                                            <div key={c.id} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10 transition-colors">
                                                {c.profile_path ? (
                                                    <img src={`${IMAGE_BASE}${c.profile_path}`} className="w-8 h-8 rounded-full object-cover" alt={c.name} />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">?</div>
                                                )}
                                                <span className="text-sm font-medium text-white/90">{c.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Production Info (New Feature) */}
                            {item.production_companies?.length > 0 && (
                                <div className="pt-6">
                                    <div className="flex flex-wrap gap-6 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                        {item.production_companies.filter(c => c.logo_path).slice(0, 3).map(c => (
                                            <img key={c.id} src={`${IMAGE_BASE}${c.logo_path}`} alt={c.name} className="h-6 object-contain invert" />
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Right: Poster (Desktop Only) */}
                        <div
                            className="hidden lg:block relative"
                        >
                            <img
                                src={`${IMAGE_BASE}${item.poster_path}`}
                                alt="Poster"
                                className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>

            {/* Similar Content Section */}
            {!isPlaying && (
                <div className="relative z-10 bg-[#0a0a0a] min-h-screen pt-20 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/5">
                    <MasonryGrid
                        title="You Might Also Like"
                        queryKey={`similar-${id}`}
                        queryFn={() => api.getSimilar(type, id)}
                    />

                    {/* Fallback Recommendation Grid */}
                    <MasonryGrid
                        title="Recommended For You"
                        queryKey={`recommended-${id}`}
                        queryFn={() => api.getRecommended(type, id)}
                    />
                </div>
            )}
        </div>
    );
};

export default Watch;
