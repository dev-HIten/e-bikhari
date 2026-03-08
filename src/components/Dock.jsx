import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

const Dock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const inputRef = useRef(null);
  const dockRef = useRef(null);

  // Sync local state with URL
  useEffect(() => {
    const query = searchParams.get("q");
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simplified Debounce
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

  const toggleSearch = () => {
    if (isSearchExpanded) {
      setIsSearchExpanded(false);
      setSearchParams({});
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.blur();
      }
    } else {
      setIsSearchExpanded(true);
      inputRef.current?.focus();
    }
  };

  const handleMouseEnter = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      setIsSearchExpanded(true);
      inputRef.current?.focus();
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      if (inputRef.current && !inputRef.current.value) {
        setIsSearchExpanded(false);
        inputRef.current.blur();
      }
    }
  };

  return (
    <div
      className="fixed z-50 flex flex-col items-end right-4 md:right-8 top-4 md:top-8 transition-all duration-500 animate-fade-in-down"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={dockRef}
        className={`pointer-events-auto flex items-center p-1 backdrop-blur-3xl saturate-150 rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 ${isSearchExpanded ? "bg-[#1c1c1e]" : "bg-white/10 hover:bg-white/20"}`}
      >
        {/* Unified Search Pill */}
        <div
          className={`flex items-center rounded-full transition-all duration-300 h-[44px] ${isSearchExpanded ? "pl-4 pr-1 gap-2" : ""}`}
        >
          <input
            ref={inputRef}
            className={`bg-transparent border-none outline-none text-white text-sm md:text-base font-medium placeholder-white/30 h-full min-w-0 transition-all duration-300 ${
              isSearchExpanded ? "w-[200px] sm:w-[260px] md:w-[300px] opacity-100" : "w-0 opacity-0 px-0"
            }`}
            placeholder="Search..."
            onChange={handleSearchChangeDebounced}
            style={{ pointerEvents: isSearchExpanded ? "auto" : "none" }}
            onFocus={() => setIsSearchExpanded(true)}
            onBlur={() => {
              if (!inputRef.current.value) {
                setIsSearchExpanded(false);
              }
            }}
          />

          <button
            onClick={toggleSearch}
            className={`w-[44px] h-[44px] rounded-full relative group flex-shrink-0 flex items-center justify-center transition-all duration-300 ${isSearchExpanded ? "text-white/50 hover:text-white" : "text-white/50 hover:text-white"}`}
            aria-label={isSearchExpanded ? "Close Search" : "Open Search"}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isSearchExpanded ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
              >
               <FiSearch size={20} />
              </div>

              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${isSearchExpanded ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}
              >
                <FiX size={20} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dock;
