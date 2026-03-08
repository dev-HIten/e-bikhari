const EpisodeSelector = ({ item, season, setSeason, seasonDetails, episode, setEpisode }) => {
    if (!item?.seasons) return null;

    return (
        <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4">
                <select
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white/90 focus:outline-none focus:border-white/30 cursor-pointer"
                >
                    {item.seasons.filter(s => s.season_number > 0).map(s => (
                        <option key={s.id} value={s.season_number}>
                            Season {s.season_number}
                        </option>
                    ))}
                </select>
                <span className="text-sm text-white/50">
                    {seasonDetails?.episodes?.length || 0} Episodes
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {seasonDetails?.episodes?.map(ep => (
                    <button
                        key={ep.id}
                        onClick={() => setEpisode(ep.episode_number)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left truncate ${
                            episode === ep.episode_number
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                        title={ep.name}
                    >
                        {ep.episode_number}. {ep.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EpisodeSelector;
