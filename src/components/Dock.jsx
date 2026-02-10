import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Dock = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const inputRef = useRef(null);
    const dockRef = useRef(null);

    // Sync local state with URL
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setIsSearchExpanded(true);
            if (inputRef.current) inputRef.current.value = query;
        }
    }, [searchParams]);

    // Global Keyboard Listener (Type to Search)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement === inputRef.current) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key.length !== 1) return;

            setIsSearchExpanded(true);
            inputRef.current?.focus();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Simplified Debounce
    const debounceTimeout = useRef(null);
    const handleSearchChangeDebounced = (e) => {
        const value = e.target.value;

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (value) {
                setSearchParams({ q: value });
                if (location.pathname !== '/') navigate('/');
            } else {
                setSearchParams({});
            }
        }, 500);
    };

    const toggleSearch = () => {
        if (isSearchExpanded) {
            setIsSearchExpanded(false);
            setSearchParams({});
            if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.blur();
            }
        } else {
            setIsSearchExpanded(true);
            inputRef.current?.focus();
        }
    };

    const handleMouseEnter = () => {
        if (window.matchMedia('(hover: hover)').matches) {
            setIsSearchExpanded(true);
            inputRef.current?.focus();
        }
    };

    const handleMouseLeave = () => {
        if (window.matchMedia('(hover: hover)').matches) {
            if (inputRef.current && !inputRef.current.value) {
                setIsSearchExpanded(false);
                inputRef.current.blur();
            }
        }
    };

    const [scrollPosition, setScrollPosition] = useState(0);

    // Track Scroll for Dynamic Positioning
    useEffect(() => {
        const handleScroll = () => setScrollPosition(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isScrolled = scrollPosition > 400; // Trigger after Hero

    // Apple Spring Physics (super smooth)
    const springTransition = {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1
    };

    return (
        <motion.div
            className="fixed z-50 flex flex-col items-end right-5 md:right-8"
            animate={{ top: isScrolled ? (window.innerWidth < 768 ? 96 : 112) : (window.innerWidth < 768 ? 20 : 32) }} // top-24 (96px) / top-28 (112px) vs top-5 (20px) / top-8 (32px)
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                ref={dockRef}
                layout
                transition={springTransition}
                className={`pointer-events-auto flex items-center p-2 backdrop-blur-3xl saturate-150 border border-white/20 rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.15)] transition-colors duration-500 ${isSearchExpanded ? 'bg-black/80' : 'bg-white/10 hover:bg-white/20'}`}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                {/* Unified Search Pill */}
                <motion.div
                    className={`flex items-center rounded-full ${isSearchExpanded ? 'pl-4 pr-1 gap-2' : ''}`}
                    layout
                    transition={springTransition}
                >
                    <motion.input
                        ref={inputRef}
                        layout
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                            width: isSearchExpanded ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 260 : 300) : 0,
                            opacity: isSearchExpanded ? 1 : 0
                        }}
                        transition={springTransition}
                        className="bg-transparent border-none outline-none text-white text-lg placeholder-white/40 h-10 min-w-0 font-medium"
                        placeholder="Search..."
                        onChange={handleSearchChangeDebounced}
                        style={{ pointerEvents: isSearchExpanded ? 'auto' : 'none' }}
                        onFocus={() => setIsSearchExpanded(true)}
                        onBlur={() => {
                            if (!inputRef.current.value) {
                                setIsSearchExpanded(false);
                            }
                        }}
                    />

                    <button
                        onClick={toggleSearch}
                        className={`p-3 rounded-full relative group flex-shrink-0 transition-all duration-300 ${isSearchExpanded ? 'bg-white/10 text-white hover:bg-white/20' : 'text-white hover:scale-110'}`}
                        aria-label={isSearchExpanded ? "Close Search" : "Open Search"}
                    >
                        <div className="relative w-6 h-6">
                            <motion.div
                                animate={{
                                    opacity: isSearchExpanded ? 0 : 1,
                                    rotate: isSearchExpanded ? 90 : 0,
                                    scale: isSearchExpanded ? 0.5 : 1
                                }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Icon name="search" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    opacity: isSearchExpanded ? 1 : 0,
                                    rotate: isSearchExpanded ? 0 : -90,
                                    scale: isSearchExpanded ? 1 : 0.5
                                }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </motion.div>
                        </div>
                    </button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const Icon = ({ name }) => {
    if (name === "search") {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        );
    }
    return null;
};

export default Dock;
