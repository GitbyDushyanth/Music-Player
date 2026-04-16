let progress = document.getElementById("progress");
    let song = document.getElementById("song");
    let ctrlIcon = document.getElementById("ctrlIcon");
    let songs = [];
    let currentSong = 0;
    let updateProgress;

    function loadSong(index) {
        const songData = songs[index];

        song.src = songData.src;
        song.load();

        document.querySelector("h1").innerText = songData.title;
        document.querySelector("p").innerText = `- ${songData.artist}`;
        document.querySelector(".song").src = songData.cover;
        progress.value = 0;

        song.onloadedmetadata = function () {
            progress.max = song.duration;
            progress.value = song.currentTime;
        };
    }

    function playPause() {
        if (ctrlIcon.classList.contains("fa-pause")) {
            song.pause();
            ctrlIcon.classList.remove("fa-pause");
            ctrlIcon.classList.add("fa-play");
        } else {
            song.play();
            ctrlIcon.classList.remove("fa-play");
            ctrlIcon.classList.add("fa-pause");
        }
    }

    song.addEventListener("play", () => {
        updateProgress = setInterval(() => {
            progress.value = song.currentTime;
        }, 500);
        document.querySelectorAll(".wave span").forEach(bar => {
        bar.style.animationPlayState = "running";
    });
    });

    song.addEventListener("pause", () => {
        clearInterval(updateProgress);
        document.querySelectorAll(".wave span").forEach(bar => {
        bar.style.animationPlayState = "paused";
    });
    });

    progress.addEventListener("input", () => {
        song.currentTime = progress.value;
        ctrlIcon.classList.remove("fa-play");
        ctrlIcon.classList.add("fa-pause");
    });

const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

nextBtn.addEventListener("click", () => {
    if (songs.length === 0) return;

    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    song.play();

    ctrlIcon.classList.remove("fa-play");
    ctrlIcon.classList.add("fa-pause");
});

prevBtn.addEventListener("click", () => {
    if (songs.length === 0) return;

    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    song.play();

    ctrlIcon.classList.remove("fa-play");
    ctrlIcon.classList.add("fa-pause");
});

    song.addEventListener("ended", () => {
        currentSong = (currentSong + 1) % songs.length;
        loadSong(currentSong);
        song.play();
        ctrlIcon.classList.remove("fa-play");
        ctrlIcon.classList.add("fa-pause");
    });

    fetch("data/songs.json")
        .then(response => response.json())
        .then(data => {
            songs = data;
            loadSong(currentSong);

            console.log("Songs loaded:", songs);
        })
        .catch(err => console.error(err));

    const currentTimeEl = document.getElementById("currentTime");
    const durationEl = document.getElementById("duration");
    
    song.addEventListener("loadedmetadata", () => {
        durationEl.innerText = formatTime(song.duration);
    });

    song.addEventListener("timeupdate", () => {
        currentTimeEl.innerText = formatTime(song.currentTime);
        const value = (song.currentTime / song.duration) * 100;
        progress.style.background = `linear-gradient(to right, #fff ${value}%, rgba(255,255,255,0.3) ${value}%)`;
    });

    function formatTime(time){
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }
    
    const volume = document.getElementById("volume");

    volume.addEventListener("input", () => {
        song.volume = volume.value;
    });