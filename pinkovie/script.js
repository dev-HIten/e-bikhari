const API_KEY = "41db5850fca65d984917616589c13722"; // 🔑 put your TMDB API Key here

async function searchMovie() {
  const movieName = document.getElementById("movieInput").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (!movieName) {
    resultDiv.innerHTML = "<p>Please enter a movie name.</p>";
    return;
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieName)}&language=en-US&page=1&api_key=${API_KEY}`,
      {
        method: "GET",
        headers: {
          accept: "application/json"
        }
      }
    );

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      resultDiv.innerHTML = `
        <div class="movie-list">
          ${data.results
            .map(
              (movie) => `
            <div class="movie-card" tabindex="0">
              <img src="${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : 'https://via.placeholder.com/300x450?text=No+Image'
              }" alt="${movie.title}" class="movie-poster"/>
              <div class="movie-info">
                <div class="movie-title" title="${movie.title}">${movie.title}</div>
                <div class="movie-rating-row">
                  <div class="movie-rating">⭐ ${movie.vote_average || "N/A"}</div>
                  <a 
                    class="play-btn" 
                    href="https://www.vidking.net/embed/movie/${movie.id}?color=ff69b4&autoPlay=true&nextEpisode=true&episodeSelector=true" 
                    target="_blank" 
                    rel="noopener"
                    title="Play Movie">
                    <span>▶</span> Play
                  </a>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else {
      resultDiv.innerHTML = "<p>❌ No movie found.</p>";
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "<p>⚠️ Error fetching data.</p>";
  }
}