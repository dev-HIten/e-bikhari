import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="w-full bg-black/40 backdrop-blur-xl border-t border-white/5 py-12 mt-20 relative z-10">
            <div className="max-w-[1800px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black tracking-tighter text-white">VEXO</h2>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                            Experience the future of streaming. Cinematic quality, zero interruptions, tailored for you.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Explore</h4>
                        <ul className="space-y-2 text-sm text-white/50">
                            <li><a href="#" className="hover:text-white transition-colors">Movies</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">TV Shows</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Trending</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">My List</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2 text-sm text-white/50">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Connect</h4>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                                <FaGithub size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                                <FaInstagram size={18} />
                            </a>
                             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                                <FaLinkedin size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-xs text-center md:text-left">
                        © {new Date().getFullYear()} Vexo Streaming. All rights reserved.
                    </p>
                    <p className="text-white/30 text-xs flex items-center gap-2">
                        <span>Made with</span>
                        <span className="text-red-500">♥</span>
                        <span>by Hiten Bhadra</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
