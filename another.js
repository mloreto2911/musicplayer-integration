const musicPlayer = {
  seekerBar: document.getElementById("seeker"),
  currentTimeSpan: document.getElementById("currentTime"),
  maxDurationSpan: document.getElementById("maxDuration"),

  formatTime: (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  },

  setSeekerValue: (value) => {
    this.seekerBar.value = value;
    this.currentTimeSpan.textContent = this.formatTime(value);
  },

  init: function () {
    this.maxDurationSpan.textContent = "0:00";

    this.seekerBar.addEventListener("input", () => {
      const value = parseInt(this.seekerBar.value);
      this.currentTimeSpan.textContent = this.formatTime(value);
      this.seekerBar.style.background = `linear-gradient(to right, black ${value}%, white ${value}%) no-repeat`;
    });
  },
};

musicPlayer.init();

// Tab Content
const tabContent = {
  lyrics: "",
  otherAlbums: "",
  relatedArtists: "",
};

// Show Respective Tab Content in explore-tab-content Element on DOM
function showTabContent(tab) {
  const exploreTabContent = document.getElementById("explore-tab-content");
  exploreTabContent.innerHTML = tabContent[tab];
}

const API_KEY = "4a864cdc0bmshd2d52f52a4a4b22p171c4ejsnb2bad9112e47";
const searchQuery = "Junko Ohashi";

const geniusOptions = {
  method: "GET",
  url: "https://genius-song-lyrics1.p.rapidapi.com/search/",
  params: {
    q: searchQuery,
    per_page: "10",
    page: "1",
  },
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
  },
};

const spotifyOptions = {
  method: "GET",
  url: "https://spotify23.p.rapidapi.com/search/",
  params: {
    q: searchQuery,
    type: "multi",
    offset: "0",
    limit: "10",
    numberOfTopResults: "5",
  },
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
  },
};

const imageElement = document.getElementById("image");

const fetchData = async () => {
  try {
    // Fetch data from Genius API
    const geniusResponse = await axios.request(geniusOptions);
    console.log("Genius API response:", geniusResponse.data);

    // Get the ID of the first song in the search results
    const songId = geniusResponse.data.hits[0].result.id;

    // Fetch the lyrics of the song using its ID
    const lyricsResponse = await axios.get(
      `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${songId}`,
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
        },
      }
    );
    console.log("Genius Lyrics API response:", lyricsResponse.data);

    // Fetch data from Spotify API
    const spotifyResponse = await axios.request(spotifyOptions);
    console.log("Spotify API response:", spotifyResponse.data.albums.items[0]);

    // Update the DOM with the fetched data
    const titleElement = document.getElementById("title");
    titleElement.textContent = geniusResponse.data.hits[0].result.title;

    const artistElement = document.getElementById("artist");
    artistElement.textContent =
      geniusResponse.data.hits[0].result.primary_artist.name;

    tabContent.lyrics =
      `<div class="lyrics">` +
      (lyricsResponse.data.lyrics.lyrics.body.html ||
        "<p>No lyrics found</p>") +
      `</div>`;

    imageElement.style.backgroundImage = `url(${spotifyResponse.data.albums.items[0].data.coverArt.sources[0].url})`;
    imageElement.style.boxShadow = "inset 0 0 0 #00000000";

    tabContent.otherAlbums = spotifyResponse.data.albums.items
      .map(
        (album) =>
          `<div class="other-albums-container" onclick="showModal('${album.data.name}', '${album.data.artist}')"><div><img src="${album.data.coverArt.sources[0].url}" alt="${album.data.name}"><p>${album.data.name}</p></div></div>`
      )
      .join("");

    tabContent.relatedArtists = spotifyResponse.data.artists.items
      .map(
        (artist) =>
          `<div class="related-artists-container"><img src="${artist.data.visuals.avatarImage.sources[2].url}" alt="${artist.data.profile.name}"><p>${artist.data.profile.name}</p></div>`
      )
      .join("");

    // Automatically display the Lyrics tab when the page loads
    showTabContent("lyrics");
  } catch (error) {
    console.error(error);
  }
};

fetchData();

// Modal functionality
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");

function showModal(title, artist) {
  modalContent.innerHTML = `
      <img src="${imageElement.style.backgroundImage
        .slice(4, -1)
        .replace(/"/g, "")}" alt="${title}">
      <h2>${title}</h2>
      <h3>${artist}</h3>
      <button class="spotify" onclick="redirectToSpotify()">Open in Spotify</button>
      <button class="play" onclick="playMusic()">Play on Website</button>
    `;

  modal.style.display = "flex";
}

function hideModal() {
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  imageElement.addEventListener("click", () => {
    const title = document.getElementById("title").textContent;
    const artist = document.getElementById("artist").textContent;
    showModal(title, artist);
  });

  window.onclick = function (event) {
    if (event.target === modal) {
      hideModal();
    }
  };
});

function redirectToSpotify() {
  // Implement the redirection to the Spotify website here
  window.alert("Redirecting to Spotify website...");
}

function playMusic() {
  // Implement the music playback on the website here
  window.alert("Playing the music on the current website...");
}