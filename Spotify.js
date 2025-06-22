// --- UPDATED JavaScript for GitHub Pages Compatibility ---
let songs;
let currFolder;
let currentSong = new Audio();

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

async function GetSongs(folder) {
  currFolder = folder;

  // GitHub Pages doesn't support directory listing, so use info.json instead
  try {
    let a = await fetch(`/Songs/${folder}/info.json`);
    let response = await a.json();
    songs = response.songs;

    let songUL = document.querySelector(".songLists ul");
    songUL.innerHTML = "";

    for (const song of songs) {
      songUL.innerHTML += `
        <li>
          <img class="invert MusicLogo" src="img/music.svg.svg" alt="music logo">
          <div class="songinfo">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Zohaib</div>
          </div>
          <div class="PlayNow">
            <span>Play Now</span>
            <img class="playButtonLogo" src="img/playButton.svg" alt="playLogo">
          </div>
        </li>`;
    }

    Array.from(document.querySelectorAll(".songLists li")).forEach(element => {
      element.addEventListener("click", () => {
        const name = element.querySelector(".songinfo div").innerText.trim();
        playMusic(name);
      });
    });

  } catch (err) {
    console.error("Failed to load songs:", err);
    songs = [];
  }

  return songs;
}

const playMusic = (track, pause = false) => {
  if (!track) {
    console.error("No track to play");
    return;
  }

  currentSong.src = `/Songs/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    playB.src = "img/paused.svg";
  }
  document.querySelector(".songinfo-bar").innerText = track.replaceAll("%20", " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function DisplayAlbums() {
  try {
    let folders = ["ncs"]; // Manually list folders, since GitHub Pages can’t list them
    let cardcontainer = document.querySelector(".cardcontainer");

    for (let fold of folders) {
      let a = await fetch(`/Songs/${fold}/info.json`);
      let response = await a.json();
      cardcontainer.innerHTML += `
        <div data-folder="${fold}" class="card">
          <div class="play">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="50" fill="#1ED760" />
              <polygon points="40,30 40,70 70,50" fill="black" />
            </svg>
          </div>
          <img src="/Songs/${fold}/card.jpg" alt="card">
          <h2>${response.title}</h2>
          <p>${response.Description}</p>
        </div>`;
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
      e.addEventListener("click", async item => {
        songs = await GetSongs(item.currentTarget.dataset.folder);
        playMusic(songs[0], false);
      });
    });
  } catch (err) {
    console.error("Album loading error:", err);
  }

  document.querySelector(".volume-container input").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  document.querySelector(".volume").addEventListener("click", () => {
    if (currentSong.volume === 1) {
      currentSong.volume = 0;
      MuteNContinue.src = "img/mute.svg";
      document.querySelector(".volume-container input").value = 0;
    } else {
      currentSong.volume = 1;
      MuteNContinue.src = "img/volume.svg";
      document.querySelector(".volume-container input").value = 10;
    }
  });

  playB.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playB.src = "img/paused.svg";
    } else {
      currentSong.pause();
      playB.src = "img/PLAY.svg";
    }
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) playMusic(songs[index + 1]);
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) playMusic(songs[index - 1]);
  });
}

async function Main() {
  await GetSongs("ncs");
  if (songs.length > 0) playMusic(songs[0], true);
  DisplayAlbums();

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });
}

Main();






