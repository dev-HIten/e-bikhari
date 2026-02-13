import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE } from '../services/api';

const MovieCard = memo(({ item }) => {
    const navigate = useNavigate();

    if (!item.poster_path) return null;

    return (
        <div
            className="group cursor-pointer flex flex-col gap-3 relative z-0 hover:z-20 will-change-transform animate-fade-in-up transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2"
            onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
        >
            {/* Card Image Container */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500 ring-1 ring-white/10 group-hover:ring-white/40">
                <img
                    src={`${IMAGE_BASE}${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                />

                {/* Premium Gradient Overlay (Subtle) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                {/* Cinematic Shine Effect (Refined) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20 overflow-hidden">
                        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:animate-[shine_1.2s_ease-out_forwards]" />
                </div>

                {/* Rating Badge (Glass) */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 shadow-lg">
                    <span className="text-[#f5c518] text-xs">★</span>
                    <span className="text-white text-xs font-bold font-display">{item.vote_average?.toFixed(1)}</span>
                </div>
            </div>

            {/* Clean Stats */}
            <div className="px-1 space-y-1">
                <h3 className="font-bold text-base leading-snug text-white/90 group-hover:text-white transition-colors duration-300 line-clamp-1 font-display tracking-tight">
                    {item.title || item.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-white/40 font-medium tracking-wide">
                    <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="uppercase">{item.media_type || 'Movie'}</span>
                </div>
            </div>
        </div>
    );
});

export default MovieCard;
