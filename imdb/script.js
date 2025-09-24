const API_KEY = "YOUR_API_KEY"; // Replace with OMDb API key
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieContainer = document.getElementById("movieContainer");
const suggestions = document.getElementById("suggestions");

// Modal
const movieModal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

async function fetchMovies(query) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

function displayMovies(data, query = "") {
  movieContainer.innerHTML = "";

  if (data.Response === "True") {
    let results = data.Search;

    // If query doesn’t exactly match, filter similar results
    if (query) {
      results = results.filter(movie =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      );
      if (results.length === 0) results = data.Search; // fallback
    }

    results.forEach(movie => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      movieCard.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/220x330?text=No+Image"}" alt="${movie.Title}">
        <div class="movie-info">
          <h2>${movie.Title}</h2>
          <p><strong>Year:</strong> ${movie.Year}</p>
          <p><strong>Type:</strong> ${movie.Type}</p>
        </div>
      `;

      movieCard.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
      movieContainer.appendChild(movieCard);
    });
  } else {
    movieContainer.innerHTML = `<p>No results found for "${query}"</p>`;
  }
}

async function fetchMovieDetails(id) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`;
  const res = await fetch(url);
  const movie = await res.json();

  modalBody.innerHTML = `
    <h2>${movie.Title} (${movie.Year})</h2>
    <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}" style="width:200px; float:left; margin-right:1rem;">
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
    <p>${movie.Plot}</p>
  `;
  movieModal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
  movieModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === movieModal) {
    movieModal.style.display = "none";
  }
});

// Search button
searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (query) {
    const data = await fetchMovies(query);
    displayMovies(data, query);
  }
});

// Enter key
searchInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      const data = await fetchMovies(query);
      displayMovies(data, query);
    }
  }
});

// Live suggestions
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (query.length < 2) {
    suggestions.style.display = "none";
    return;
  }

  const data = await fetchMovies(query);
  if (data.Response === "True") {
    suggestions.innerHTML = "";
    data.Search.slice(0, 5).forEach(movie => {
      const p = document.createElement("p");
      p.textContent = movie.Title;
      p.addEventListener("click", async () => {
        searchInput.value = movie.Title;
        suggestions.style.display = "none";
        const movieData = await fetchMovies(movie.Title);
        displayMovies(movieData, movie.Title);
      });
      suggestions.appendChild(p);
    });
    suggestions.style.display = "block";
  } else {
    suggestions.style.display = "none";
  }
});
