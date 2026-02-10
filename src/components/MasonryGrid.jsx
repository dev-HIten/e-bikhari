import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE } from '../services/api';
import SkeletonCard from './SkeletonCard';
import NetworkError from './NetworkError';

const MasonryGrid = ({ title, queryKey, queryFn }) => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [queryKey],
        queryFn,
        retry: 1
    });
    const ref = useRef(null);

    // Subtle parallax for grid items
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    if (isError) {
        return (
            <section className="px-4 md:px-8 py-12 max-w-[1800px] mx-auto">
                <h2 className="text-2xl font-bold text-white/50 mb-8">{title}</h2>
                <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                    <NetworkError onRetry={refetch} />
                </div>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="px-4 md:px-8 py-12 max-w-[1800px] mx-auto">
                <div className="h-10 w-48 bg-white/5 rounded mb-12 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12">
                    {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </section>
        );
    }

    const items = data?.results || [];

    if (items.length === 0) {
        return (
            <section className="h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                        <path d="M10 21h4a9 9 0 1 0-9-9v3m0 0 4-4m-4 4-4-4" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
                <p className="text-white/50 max-w-sm">We couldn't find anything matching your search. Try adjusting your filters or search term.</p>
            </section>
        );
    }

    return (
        <section ref={ref} className="px-4 md:px-8 py-12 max-w-[1800px] mx-auto">
            <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black mb-12 text-white/90 tracking-tighter"
            >
                {title}
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12">
                {items.map((item, index) => (
                    item.poster_path && (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -10, scale: 1.05 }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                            viewport={{ once: true, margin: "50px" }}
                            className="group cursor-pointer flex flex-col gap-3 relative z-0 hover:z-20 will-change-transform" // Increased z-index on hover
                            onClick={() => navigate(`/watch/${item.media_type || 'movie'}/${item.id}`)}
                        >
                            {/* Card Image Container */}
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 ring-1 ring-white/10 group-hover:ring-white/30">
                                <motion.img
                                    initial={{ opacity: 0, filter: "blur(10px)" }}
                                    whileInView={{ opacity: 1, filter: "blur(0px)" }}
                                    transition={{ duration: 0.5 }}
                                    src={`${IMAGE_BASE}${item.poster_path}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" // Smoother scale
                                    loading="lazy"
                                />

                                {/* Premium Gradient Overlay (Subtle) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                {/* Cinematic Shine Effect (Refined) */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 overflow-hidden">
                                     <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:animate-[shine_1s_ease-out_forwards]" />
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
                        </motion.div>
                    )
                ))}
            </div>
        </section>
    );
};

export default MasonryGrid;
