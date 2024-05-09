console.log("Let's start JS");

// Predefine audio element
let currentsong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
console.log(secondsToMinutesSeconds(65)); // Output: "01:05"
console.log(secondsToMinutesSeconds(125)); // Output: "02:05"

async function getsongs() {
    try {
        let a = await fetch("http://127.0.0.1:5500/songs/");
        let response = await a.text();

        console.log(response);
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];

            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split("/songs")[1]);
            }
        }
        return songs;
    } catch (error) {
        console.error("Error occurred:", error);
        return []; // Return an empty array if an error occurs
    }
}

const playmusic = (track, pause = false) => {
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
    }
    currentsong.pause(); // Pause the current song
    currentsong = new Audio("/songs/" + track); // Create a new Audio element
    currentsong.play();
    play.src = "pause.svg"

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function main() {
    try {
        let songs = await getsongs();

        playmusic(songs[0], true)
        let songsul = document.querySelector(".songlist").getElementsByTagName("ul")[0];

        for (const song of songs) {
            let li = document.createElement("li");
            li.innerHTML = `
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${decodeURIComponent(song)}</div>
                    <div>Shami</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg" alt="">
                </div>`;
            songsul.appendChild(li);
        }

        // Event delegation
        songsul.addEventListener("click", function (event) {
            let target = event.target;
            if (target.tagName === "SPAN" && target.textContent === "Play Now") {
                let track = target.parentNode.previousElementSibling.firstElementChild.textContent.trim();
                playmusic(track);
            }
        });

        play.addEventListener("click", () => {
            if (currentsong.paused) {
                currentsong.play();
                play.src = "pause.svg"
            } else {
                currentsong.pause();
                play.src = "play.svg"
            }
        });

        currentsong.addEventListener("canplay", () => {
            console.log("Audio can play");
            console.log("Duration:", currentsong.duration);
        });

        currentsong.addEventListener("timeupdate", () => {
            console.log("Time Update:", currentsong.currentTime);
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
            document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";


        });
        // document.querySelector(".seekbar").addEventListener("input",function(event){
        //     const seekbar=event.target.value;
        //     const newpositon=(seekbar/100)+currentsong.duration;
        //     currentsong.currentTime=newpositon;
        // })

        document.querySelector(".seekbar").addEventListener("click",e=>{
            let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
            document.querySelector(".circle").style.left=percent+"%";
            currentsong.currentTime=((currentsong.duration)*percent)/100
        })

    } catch (error) {
        console.error("Error occurred:", error);
    }
}

// Function to play music
main();
