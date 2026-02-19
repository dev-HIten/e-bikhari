import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE } from '../services/api';
import SkeletonCard from './SkeletonCard';
import NetworkError from './NetworkError';
import MovieCard from './MovieCard';

const MasonryGrid = ({ title, queryKey, queryFn }) => {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [queryKey],
        queryFn,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const ref = useRef(null);

    // Subtle parallax for grid items
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    if (isError) {
        return (
            <section ref={ref} className="px-4 md:px-8 py-12 max-w-[1800px] mx-auto">
                <h2 className="text-2xl font-bold text-white/50 mb-8">{title}</h2>
                <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                    <NetworkError onRetry={refetch} />
                </div>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section ref={ref} className="px-4 md:px-8 py-12 max-w-[1800px] mx-auto">
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12" style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' }}>
                {items.map((item) => (
                    <MovieCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
};

export default MasonryGrid;
