import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import SkeletonCard from './SkeletonCard';
import NetworkError from './NetworkError';
import MovieCard from './MovieCard';

const MasonryGrid = ({ title, queryKey, queryFn }) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [queryKey],
        queryFn,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const ref = useRef(null);

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
                <p className="text-white/50 max-w-sm">We couldn&apos;t find anything matching your search. Try adjusting your filters or search term.</p>
            </section>
        );
    }

    return (
        <section ref={ref} className="px-4 md:px-8 py-12 max-w-[1800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-8 text-white/90 tracking-tight">
                {title}
            </h2>

            <div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 gap-y-8 md:gap-y-12" 
                style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' }}
            >
                {items.map((item) => (
                    <MovieCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
};

export default MasonryGrid;
