async function searchSongs() {
    const query = document.getElementById("search-query").value;
    const songList = document.getElementById("song-list");
    songList.innerHTML = "";
    try {
        const response = await fetch(`https://jiosaavn-api-privatecvc2.vercel.app/search/songs?query=${query}&limit=25&page=1`);
        const data = await response.json();
        const songs = data.data.results || [];
        console.log(songs);
        
        if (songs.length === 0) {
            throw new Error("No songs found");
        }
        
        for (let i = 0; i < 20 && i < songs.length; i++) {
            createSongCard(songs[i], songList);
        }
    } catch (error) {
        console.error("Error fetching songs", error);
        songList.innerHTML = "<p>No songs found</p>";
    }
}

function playPause() {
    const audioPlayer = document.getElementById("audio-player");
    let icon = document.getElementById("play-icon");
    if (icon.classList.contains("fa-play")) {
        icon.classList.replace("fa-play", "fa-pause");
        audioPlayer.play();
    } else {
        icon.classList.replace("fa-pause", "fa-play");
        audioPlayer.pause();
    }
}

function createSongCard(song, songList) {
    const card = document.createElement("div");
    card.classList.add("card");
    const imageUrl = `/image/?url=${encodeURIComponent(song.image[1].link || 'https://via.placeholder.com/200')}`;
    card.innerHTML = `
        <img src ="${imageUrl}" class = "images"></img>
                <div class = "card-body">
                    <span class="song-name">${song.name ||"Unkown Song"}</span>
                    <span class="artist-name">${song.primaryArtists ||"Unkown Artist"}</span>
                    <div class="play-down">
                        <div class = "play-btn")><i class="fa-solid fa-play"></i></div>
                        <div class = "download-btn"><i class="fas fa-download"></i></div>
                    </div>
                </div>
    `;
    const play= card.querySelector(".play-btn");
    play.onclick = () => playmySong(song);

    const down = card.querySelector(".download-btn");
    down.onclick = () => downloadSong(song);

    songList.appendChild(card);
}
function playmySong(song) {
    const player = document.getElementById("audio-player");
    const nowPlaying = document.getElementById("now-playing");
    const nowArtist = document.getElementById("artist-name");
    const albumArt = document.getElementById("album-art");
    let icon = document.getElementById("play-icon");
    icon.classList.replace("fa-play", "fa-pause");
    const artLink = `/image/?url=${encodeURIComponent(song.image[1].link || 'https://via.placeholder.com/60')}`;
    let URL = song.downloadUrl.find(link => link.quality === '320kbps').link || song.downloadUrl[0];
    albumArt.src = artLink;
    console.log(URL);
    const downloadUrl = `/stream/?url=${encodeURIComponent(URL)}`;
    console.log(downloadUrl);
    player.src = downloadUrl || "";
    player.play();
    nowPlaying.textContent = `${song.name || "Unknown Song"}`;
    nowArtist.textContent = `${song.primaryArtists || "Unknown Artist"}`;
}
function updateProgress() {
    const player = document.getElementById("audio-player");
    const progress = document.getElementById("progress");
    const progressBar = document.querySelector(".progress-tracker");
    const currentTime = document.getElementById("current-time");

    if (player.duration) {
        const progressPercent = (player.currentTime / player.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTime.textContent = formatTime(player.currentTime);
    }
}
function downloadSong(song) {
    const downloadUrl = song.downloadUrl.find(link => link.quality === '320kbps').link || song.downloadUrl[0];
    const filename = `${song.name || "Unknown_Song"}`;
    console.log(downloadUrl);
    console.log(filename);
    const link = document.createElement('a');
    link.href = `/download/?url=${downloadUrl}&filename=${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateDuration() {
    const player = document.getElementById("audio-player");
    const duration = document.getElementById("duration");
    duration.textContent = formatTime(player.duration);
}

function seek(event) {
    const player = document.getElementById("audio-player");
    const progressBar = document.querySelector(".progress-tracker");
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const width = rect.width;
    const seekTime = (offsetX / width) * player.duration;
    player.currentTime = seekTime;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

var input = document.getElementById("search-query");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchSongs();
  }
});

let audioPlayerEvent = document.getElementById("audio-player");

audioPlayerEvent.onplay = () => {
    const playBtn = document.getElementById("play-icon");
    playBtn.classList.replace("fa-play", "fa-pause");
};

audioPlayerEvent.onpause = () => {
    const playBtn = document.getElementById("play-icon");
    playBtn.classList.replace("fa-pause", "fa-play");
};

document.addEventListener('keydown', function(event) {
    if (event.code === "Space" && !event.target.matches("input, textarea")) {
        event.preventDefault();
        playPause();
    }
});