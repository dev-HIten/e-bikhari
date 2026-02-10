import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import MediaCard from './MediaCard';

const MediaRow = ({ title, queryKey, queryFn }) => {
    const { data, isLoading } = useQuery({ queryKey: [queryKey], queryFn });
    const scrollRef = useRef(null);

    if (isLoading) return <div className="h-64 flex items-center justify-center text-white/20">Loading...</div>;

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mb-12"
        >
            <h2 className="px-[6%] text-xl font-semibold mb-4 text-white/70 flex items-center gap-4">
                {title}
                <div className="h-[1px] bg-white/10 flex-1" />
            </h2>

            <div
                ref={scrollRef}
                className="flex gap-4 px-[6%] overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none' }}
            >
                {data?.results?.map((item) => (
                    item.poster_path && <MediaCard key={item.id} item={item} />
                ))}
            </div>
        </motion.section>
    );
};

export default MediaRow;
