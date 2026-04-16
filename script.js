const song = document.getElementById("song");
const ctrlIcon = document.getElementById("ctrlIcon");
const progress = document.getElementById("progress");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const imgEl = document.querySelector(".song");
const playlistEl = document.getElementById("playlist");
const volume = document.getElementById("volume");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

let songs = [];
let currentSong = 0;

function loadSong(index) {
    const s = songs[index];

    song.src = s.src;
    titleEl.innerText = s.title;
    artistEl.innerText = s.artist;
    imgEl.src = s.cover;

    song.load();
}

function playPause() {
    if (song.paused) {
        song.play();
        ctrlIcon.classList.replace("fa-play", "fa-pause");
    } else {
        song.pause();
        ctrlIcon.classList.replace("fa-pause", "fa-play");
    }
}

document.querySelector(".next-btn").onclick = () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    song.play();
    renderPlaylist();
};

document.querySelector(".prev-btn").onclick = () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    song.play();
    renderPlaylist();
};
song.addEventListener("loadedmetadata", () => {
    durationEl.innerText = formatTime(song.duration);
});

song.addEventListener("timeupdate", () => {
    if (!song.duration) return;

    const value = (song.currentTime / song.duration) * 100;
    progress.value = value;

    currentTimeEl.innerText = formatTime(song.currentTime);
});

progress.oninput = () => {
    song.currentTime = (progress.value / 100) * song.duration;
};

/* VOLUME */
volume.oninput = () => {
    song.volume = volume.value;
};

function formatTime(time) {
    if (!time) return "0:00";

    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);

    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

/* PLAYLIST */
function renderPlaylist() {
    playlistEl.innerHTML = "";

    songs.forEach((s, i) => {
        const div = document.createElement("div");
        div.className = "song-item" + (i === currentSong ? " active" : "");

        div.innerHTML = `
            <img src="${s.cover}">
            <div>
                <p>${s.title}</p>
                <small>${s.artist}</small>
            </div>
        `;

        div.onclick = () => {
    currentSong = i;
    loadSong(i);
    song.play();
    ctrlIcon.classList.replace("fa-play", "fa-pause");

    renderPlaylist();
};

        playlistEl.appendChild(div);
    });
}

song.onplay = () => {
    document.querySelectorAll(".wave span").forEach(el => {
        el.style.animationPlayState = "running";
    });
};

song.onpause = () => {
    document.querySelectorAll(".wave span").forEach(el => {
        el.style.animationPlayState = "paused";
    });
};

fetch("data/songs.json")
    .then(res => res.json())
    .then(data => {
        songs = data;
        loadSong(0);
        renderPlaylist();
    });