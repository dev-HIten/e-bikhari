import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const inputRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const genreId = searchParams.get('genre');

    // Genre List
    const genres = [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 99, name: "Documentary" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Family" },
        { id: 14, name: "Fantasy" },
        { id: 36, name: "History" },
        { id: 27, name: "Horror" },
        { id: 10402, name: "Music" },
        { id: 9648, name: "Mystery" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Sci-Fi" },
        { id: 10770, name: "TV Movie" },
        { id: 53, name: "Thriller" },
        { id: 10752, name: "War" },
        { id: 37, name: "Western" },
    ];

    const handleGenreClick = (g) => {
        if (genreId === String(g.id)) {
            setSearchParams({}); // Deselect
        } else {
            setSearchParams({ genre: g.id, name: g.name });
            if (location.pathname !== "/") navigate(`/?genre=${g.id}&name=${g.name}`);
        }
    };

    // Sync local state with URL
    useEffect(() => {
        const query = searchParams.get("q");
        if (query) {
            setIsSearchExpanded(true);
            if (inputRef.current) inputRef.current.value = query;
        }
    }, [searchParams]);

    // Handle Scroll for Background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50); // Increased threshold
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Direct Type to Search & Escape to Close
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Escape Key: Close Search
            if (e.key === 'Escape') {
                handleClearSearch();
                return;
            }

            // Check if user is typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Check if key is a single alphanumeric character
            if (e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
                setIsSearchExpanded(true);
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleClearSearch = () => {
        setIsSearchExpanded(false);
        setSearchParams({});
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.blur();
        }
        if (location.pathname !== "/") navigate("/");
    };

    // Simplified Debounce for Search
    const debounceTimeout = useRef(null);
    const handleSearchChangeDebounced = (e) => {
        const value = e.target.value;

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (value) {
                setSearchParams({ q: value });
                if (location.pathname !== "/") navigate("/");
            } else {
                setSearchParams({});
            }
        }, 500);
    };

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-4 py-3 transition-all duration-500"
            style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Categories (Scrollable Left) - Always visible now */}
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 mask-linear-fade transition-opacity duration-500 opacity-100 pointer-events-auto"
                style={{
                    maskImage: 'linear-gradient(to right, black 95%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, black 95%, transparent)'
                }}
            >
                {genres.map(g => (
                    <button
                        key={g.id}
                        onClick={() => handleGenreClick(g)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                            genreId === String(g.id)
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                : 'bg-white/10 border-white/5 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/20'
                        }`}
                    >
                        {g.name}
                    </button>
                ))}
            </div>

            {/* Search Pill (FixedWidth Right) */}
            <motion.div
                layout
                className={`flex-shrink-0 flex items-center h-10 rounded-full transition-all duration-300 border ${
                    isSearchExpanded 
                    ? "bg-[#1c1c1e] border-white/20 w-full md:w-[300px]" 
                    : "bg-white/10 border-white/5 w-10 md:w-[260px] hover:bg-white/20"
                }`}
            >
                <div className="flex items-center justify-center w-10 h-10 text-white/50">
                    <FiSearch size={18} />
                </div>
                
                <input
                    ref={inputRef}
                    className={`bg-transparent border-none outline-none text-white text-sm placeholder-white/30 h-full w-full pr-4 ${
                        !isSearchExpanded && "hidden md:block" // Hide text on mobile when collapsed
                    }`}
                    placeholder="Search movies & shows..."
                    onFocus={() => setIsSearchExpanded(true)}
                    onBlur={() => {
                        if (!inputRef.current.value) setIsSearchExpanded(false);
                    }}
                    onChange={handleSearchChangeDebounced}
                />

                {/* X Button for Clearing */}
                {isSearchExpanded && (
                     <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent focusing input again if needed
                            handleClearSearch();
                        }}
                        className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                     >
                         <FiX size={18} />
                     </button>
                )}
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;
