import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE } from '../services/api';

const MovieCard = memo(({ item }) => {
    const navigate = useNavigate();

    if (!item.poster_path) return null;

    return (
        <div
            className="group cursor-pointer flex flex-col gap-2 relative z-0 hover:z-20 transition-all duration-200 ease-out hover:scale-[1.03] will-change-transform"
            onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
        >
            {/* Card Image Container */}
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] shadow-md group-hover:shadow-xl transition-shadow duration-200 ring-1 ring-white/5 group-hover:ring-white/20">
                <img
                    src={`${IMAGE_BASE}${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                />

                {/* Simple Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-200" />

                {/* Rating Badge (Simplified) */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[#f5c518] text-[10px]">★</span>
                    <span className="text-white text-[10px] font-bold">{item.vote_average?.toFixed(1)}</span>
                </div>
            </div>

            {/* Clean Stats */}
            <div className="px-1">
                <h3 className="font-bold text-sm md:text-base leading-snug text-white/90 group-hover:text-white transition-colors duration-200 line-clamp-1 truncate">
                    {item.title || item.name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-white/50 font-medium uppercase mt-0.5">
                    <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{item.media_type || 'Movie'}</span>
                </div>
            </div>
        </div>
    );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
