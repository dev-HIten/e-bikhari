import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AmbientLight from './components/AmbientLight';
import Footer from './components/Footer';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Watch = lazy(() => import('./pages/Watch'));
const Catalog = lazy(() => import('./pages/Catalog'));
const MyList = lazy(() => import('./pages/MyList'));

import { useOnlineStatus } from './hooks/useOnlineStatus';

import ScrollToTop from './components/ScrollToTop';

function App() {
    const location = useLocation();
    const isOnline = useOnlineStatus();

    return (
        <>
            <ScrollToTop />
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
                <Suspense fallback={
                    <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
                        <span className="text-white/50 text-sm font-medium tracking-widest uppercase">Loading...</span>
                    </div>
                }>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/movies" element={<Catalog type="movies" />} />
                        <Route path="/tv" element={<Catalog type="tv" />} />
                        <Route path="/new" element={<Catalog type="new" />} />
                        <Route path="/mylist" element={<MyList />} />
                        <Route path="/watch/:type/:id" element={<Watch />} />
                    </Routes>
                    <Footer />
                </Suspense>
            </div>
        </>
    );
}

export default App;
