import MasonryGrid from '../components/MasonryGrid';
import { api } from '../services/api';

const Catalog = ({ type }) => {
    // type prop can be "movies", "tv", "new" passed from Router

    let title = "";
    let queryKey = "";
    let queryFn = null;

    switch (type) {
        case 'movies':
            title = "Popular Movies";
            queryKey = "popularMovies";
            queryFn = () => api.getPopularMovies(1);
            break;
        case 'tv':
            title = "Popular TV Shows";
            queryKey = "popularTV";
            queryFn = () => api.getPopularTV(1);
            break;
        case 'new':
            title = "New & Popular";
            queryKey = "trending";
            queryFn = () => api.getTrending(1);
            break;
        default:
            title = "Catalog";
            queryKey = "trending";
            queryFn = () => api.getTrending(1);
    }

    return (
        <div className="min-h-[100dvh] bg-[#0a0a0a] pt-20 pb-24 md:pt-24 md:pb-32">
            <MasonryGrid
                title={title}
                queryKey={queryKey}
                queryFn={queryFn}
            />
        </div>
    );
};

export default Catalog;
