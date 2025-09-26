
const YT_KEY = "AIzaSyAjfO48kiHr4NQnVZY5y7wnWL2CcRFh5R0";

const moviesCarousel = document.getElementById("moviesCarousel");
const musicCarousel = document.getElementById("musicCarousel");
const searchInput = document.getElementById("searchInput");


async function loadMovies(query = "html css") {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=15&q=${encodeURIComponent(query)}&key=${YT_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  displayMovies(data.items || []);
}

function displayMovies(videos) {
  moviesCarousel.innerHTML = "";
  if (videos.length === 0) {
    moviesCarousel.innerHTML = "<p>No videos found</p>";
    return;
  }

  videos.forEach(video => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high.url;
    const channel = video.snippet.channelTitle;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${thumbnail}" alt="${title}" />
      <p>${title}</p>
    `;
    card.onclick = () => showDetails(
      title,
      `Channel: ${channel}`,
      thumbnail,
      null,
      videoId
    );
    moviesCarousel.appendChild(card);
  });
}


async function loadMusic(query = "ar rahman") {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=15`;
  const res = await fetch(url);
  const data = await res.json();
  displayMusic(data.results || []);
}

function displayMusic(tracks) {
  musicCarousel.innerHTML = "";
  if (tracks.length === 0) {
    musicCarousel.innerHTML = "<p>No music found</p>";
    return;
  }

  tracks.forEach(track => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${track.artworkUrl100}" alt="${track.trackName}" />
      <p>${track.trackName}</p>
      <p>${track.artistName}</p>
    `;
    card.onclick = () => showDetails(
      track.trackName,
      track.artistName,
      track.artworkUrl100,
      track.previewUrl
    );
    musicCarousel.appendChild(card);
  });
}


function showDetails(title, desc, img, audio = null, videoId = null) {
  const detailModal = document.getElementById("detailModal");
  const videoContainer = document.getElementById("videoContainer");
  const audioEl = document.getElementById("musicPreview");


  document.getElementById("detailTitle").innerText = title;
  document.getElementById("detailDescription").innerText = desc;
  document.getElementById("detailImage").src = img;

  if (audio) {
    audioEl.style.display = "block";
    audioEl.src = audio;
  } else {
    audioEl.style.display = "none";
    audioEl.src = "";
  }

  if (videoId) {
    videoContainer.innerHTML = `
      <iframe
        width="100%" 
        height="380" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
      </iframe>
    `;
  } else {
    videoContainer.innerHTML = "";
  }

  detailModal.style.display = "block";
}


document.getElementById("closeModal").onclick = () => {
  document.getElementById("detailModal").style.display = "none";
};

let searchTimeout;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  const q = e.target.value.trim();
  searchTimeout = setTimeout(() => {
    if (q.length > 2) {
      loadMovies(q + " trailer");
      loadMusic(q);
    }
  }, 500);
});


loadMovies();
loadMusic();

