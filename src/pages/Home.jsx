import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import SpotlightHero from '../components/SpotlightHero';
import MasonryGrid from '../components/MasonryGrid';
import NetworkError from '../components/NetworkError';
import { useWatchlist } from '../hooks/useWatchlist';
import { motion } from 'framer-motion';

import LazyLoad from '../components/LazyLoad';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const genreId = searchParams.get('genre');
    const genreName = searchParams.get('name');
    const { watchlist } = useWatchlist(); // Get watchlist

    // Trending & Hero
    const { data: trending, isError: isHeroError, isLoading: isHeroLoading, refetch: refetchHero } = useQuery({
        queryKey: ['trending'],
        queryFn: () => api.getTrending(1),
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    const heroItem = trending?.results?.[0];

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-32 pt-20">
            {!query && !genreId ? (
                // Standard Home Feed
                <>
                    {isHeroError ? (
                        <div className="min-h-screen w-full flex items-center justify-center">
                            <NetworkError onRetry={refetchHero} />
                        </div>
                    ) : isHeroLoading ? (
                        // Hero Skeleton
                        <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
                            <div className="absolute inset-0 animate-pulse bg-white/5" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                        </div>
                    ) : (
                        <SpotlightHero item={heroItem} />
                    )}



                    <div className="space-y-16 relative z-10 pb-20 -mt-20 md:-mt-32">
                        {/* My List Section */}
                        {watchlist.length > 0 && (
                            <MasonryGrid
                                title="My List"
                                queryKey="watchlist"
                                queryFn={() => Promise.resolve({ results: watchlist })}
                            />
                        )}

                        <LazyLoad>
                            <MasonryGrid title="Trending Now" queryKey="trending" queryFn={() => api.getTrending(1)} />
                        </LazyLoad>

                        <LazyLoad>
                            <MasonryGrid title="Top Rated" queryKey="topRated" queryFn={() => api.getTopRated(1)} />
                        </LazyLoad>

                        <LazyLoad>
                            <MasonryGrid title="Action Collection" queryKey="action" queryFn={() => api.getActionMovies(1)} />
                        </LazyLoad>
                    </div>
                </>
            ) : genreId ? (
                // Genre Feed
                <div className="pt-32">
                    <div className="px-4 md:px-8 mb-4 flex items-center gap-4">
                        <button onClick={() => setSearchParams({})} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">{genreName} Movies</h1>
                    </div>


                    <MasonryGrid
                        title={`Top ${genreName}`}
                        queryKey={`genre-${genreId}`}
                        queryFn={() => api.getByGenre(genreId, 1)}
                    />
                </div>
            ) : (
                // Search Results Feed
                <div className="pt-32">
                    <MasonryGrid
                        title={`Results for "${query}"`}
                        queryKey={`search-${query}`}
                        queryFn={() => api.search(query, 1)}
                    />
                </div>
            )}
        </div>
    );
};

export default Home;
