import React from 'react';
import { motion } from 'framer-motion';
import { BACKDROP_BASE } from '../services/api';
import { useNavigate } from 'react-router-dom';

const MediaCard = ({ item }) => {
    const navigate = useNavigate();
    const imagePath = item.backdrop_path || item.poster_path; // Prefer landscape

    return (
        <motion.div
            className="relative flex-shrink-0 cursor-pointer rounded-xl overflow-hidden aspect-video w-[200px] sm:w-[240px] md:w-[280px] group shadow-[0_8px_30px_rgba(0,0,0,0.2)] ring-1 ring-white/10 hover:ring-white/30 transition-all duration-500"
            whileHover={{
                scale: 1.05,
                zIndex: 20,
                transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 30 }
            }}
            onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
        >
            <img
                src={`${BACKDROP_BASE}${imagePath}`}
                alt={item.title || item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
            />

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 overflow-hidden">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:animate-[shine_0.8s_ease-out_forwards]" />
            </div>

            {/* Content Overlay */}
            <motion.div
                initial={{ opacity: 0.8, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent"
            >
                <h4 className="text-white text-sm font-bold truncate font-display tracking-tight drop-shadow-md">
                    {item.title || item.name}
                </h4>
                <div className="flex items-center gap-3 text-[10px] sm:text-xs text-white/60 font-medium mt-1.5">
                    <span className="text-green-400 font-bold">98% Match</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
                    <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                    <span className="ml-auto border border-white/20 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">HD</span>
                </div>
            </motion.div>
        </motion.div>
    );

};

export default React.memo(MediaCard);
