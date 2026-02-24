import { FaInstagram } from 'react-icons/fa';
import { SiPhonepe } from 'react-icons/si';

const Footer = () => {
    return (
        <footer className="w-full bg-black/40 backdrop-blur-xl border-t border-white/5 py-12 mt-20 relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
            
            <div className="max-w-[1800px] mx-auto px-4 md:px-8 relative z-10">
                
                <div className="text-center mb-12">
                   <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Recommended Tools</h2>
                   <p className="text-white/40">Services to level up your financial game</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
                    
                    {/* Card 1: Slice */}
                    <div className="group relative bg-[#1a1a1a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:bg-[#1a1a1a]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-5px_rgba(147,51,234,0.3)] hover:border-purple-500/30 flex flex-col items-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                        
                        <div className="h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                             <img 
                                src="/slice_logo_full.png" 
                                alt="slice" 
                                className="h-8 object-contain"
                            />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">slice</h3>
                        <p className="text-white/60 text-sm mb-6 leading-relaxed flex-grow">
                             Students! Earn while you spend. Daily interest at <span className="text-green-400 font-bold">100% RBI repo rate</span>.
                        </p>
                        
                        <div className="w-full space-y-3 mt-auto">
                            <div className="bg-white/5 rounded-lg py-2 px-3 border border-dashed border-white/10 flex items-center justify-between">
                                <span className="text-xs text-white/40 uppercase tracking-wider">Referral Code</span>
                                <span className="text-yellow-400 font-mono font-bold select-all text-sm">&HITEN88802</span>
                            </div>
                            <a 
                                href="https://t.sliceit.com/s?c=A4QgA2g&ic=HITEN88802" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-full transition-all shadow-lg shadow-purple-900/40"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>

                    {/* Card 2: Groww */}
                    <div className="group relative bg-[#1a1a1a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:bg-[#1a1a1a]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-5px_rgba(0,213,157,0.3)] hover:border-[#00d59d]/30 flex flex-col items-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#00d59d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                        
                        <div className="h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                             <img 
                                src="/groww_icon.png" 
                                alt="Groww" 
                                className="h-14 object-contain bg-white rounded-lg p-2"
                            />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d59d] transition-colors">Groww</h3>
                        <p className="text-white/60 text-sm mb-6 leading-relaxed flex-grow">
                             Invest in Stocks, Mutual Funds, and IPOs. Zero demat account opening fee.
                        </p>
                        
                        <div className="w-full mt-auto">
                            <a 
                                href="https://groww.in/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full bg-[#00d59d] hover:bg-[#00e6aa] text-black font-bold py-3 rounded-full transition-all shadow-lg shadow-[#00d59d]/40"
                            >
                                Start Investing
                            </a>
                        </div>
                    </div>

                    {/* Card 3: Airtel Payments Bank */}
                    <div className="group relative bg-[#1a1a1a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:bg-[#1a1a1a]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-5px_rgba(239,68,68,0.3)] hover:border-red-500/30 flex flex-col items-center text-center">
                         <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                         
                         <div className="h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <img 
                                src="/airtel_payments_bank_logo.png" 
                                alt="Airtel" 
                                className="h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                            />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Safe Account</h3>
                        <p className="text-white/60 text-sm mb-6 leading-relaxed flex-grow">
                            Keep regular payments separate and secure. Get <span className="text-green-400 font-bold">₹100 instant cashback</span> on opening.
                        </p>

                         <div className="w-full mt-auto">
                            <a 
                                href="https://i.airtel.in/refandearnK0X0TCCKYC" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/40"
                            >
                                Open Account
                            </a>
                        </div>
                    </div>

                    {/* Card 4: PhonePe */}
                    <div className="group relative bg-[#1a1a1a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:bg-[#1a1a1a]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-5px_rgba(95,37,159,0.3)] hover:border-[#5f259f]/30 flex flex-col items-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#5f259f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />

                        <div className="w-16 h-16 bg-[#5f259f]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-[#5f259f]/20">
                             <SiPhonepe className="text-3xl text-[#5f259f]" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#a855f7] transition-colors">PhonePe</h3>
                        <p className="text-white/60 text-sm mb-6 leading-relaxed flex-grow">
                            Simple, secure UPI payments. Link bank account, set PIN, and go!
                        </p>

                         <div className="w-full mt-auto">
                            <a 
                                href="https://phon.pe/2pq0eoh3" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full bg-[#5f259f] hover:bg-[#4b1d7e] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#5f259f]/40"
                            >
                                Download App
                            </a>
                        </div>
                    </div>

                </div>

                {/* Creator & Contact - Minimal */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm">
                    <p className="text-white/30 flex items-center gap-2 mb-4 md:mb-0">
                        <span>Made with</span>
                        <span className="text-red-500 animate-pulse">♥</span>
                        <span>by Hiten Bhadra</span>
                    </p>
                    
                    <a 
                        href="https://instagram.com/iamhitenbhadra" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
                    >
                        <FaInstagram className="text-lg" />
                        <span>@iamhitenbhadra</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
