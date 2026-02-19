import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AmbientLight from './components/AmbientLight';
import Footer from './components/Footer';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Watch = lazy(() => import('./pages/Watch'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Catalog = lazy(() => import('./pages/Catalog'));
const MyList = lazy(() => import('./pages/MyList'));

import { useOnlineStatus } from './hooks/useOnlineStatus';

function App() {
    const location = useLocation();
    const isOnline = useOnlineStatus();

    // Fade out initial loader on mount
    useEffect(() => {
        const loader = document.querySelector('.initial-loader');
        if (loader) {
            // Small delay to ensure the app is actually painted
            requestAnimationFrame(() => {
                loader.classList.add('fade-out');
                setTimeout(() => loader.remove(), 600); // Remove from DOM after transition
            });
        }
    }, []);

    return (
        <>
            <AmbientLight />

            {/* Offline Banner */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 z-[100] bg-[#E50914] text-white text-xs md:text-sm font-bold text-center py-2 px-4 shadow-lg animate-slideDown">
                    You are currently offline. Check your internet connection.
                </div>
            )}

            {/* Navbar Navigation */}
            {!location.pathname.includes('/watch') && (
                <Navbar />
            )}

            <div className="min-h-screen bg-[#0a0a0a]">
                <AnimatePresence mode="wait">
                    <Suspense fallback={
                        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a]">
                            <div className="w-[60px] h-[60px] bg-white rounded-full animate-[ping_1.5s_ease-in-out_infinite] opacity-20 relative">
                                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50"></div>
                            </div>
                            {/* Matching the index.html vibe but using Tailwind */}
                            <div className="absolute w-[60px] h-[60px] bg-white rounded-full opacity-80 animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.4)]"></div>
                        </div>
                    }>
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Home />} />
                            <Route path="/movies" element={<Catalog type="movies" />} />
                            <Route path="/tv" element={<Catalog type="tv" />} />
                            <Route path="/new" element={<Catalog type="new" />} />
                            <Route path="/mylist" element={<MyList />} />
                            <Route path="/watch/:type/:id" element={<Watch />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        <div className="animate-fade-in-up">
                            <Footer />
                        </div>
                    </Suspense>
                </AnimatePresence>
            </div>
        </>
    );
}

export default App;
