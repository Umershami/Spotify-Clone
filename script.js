console.log("Let's start JS");

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

async function main() {
    try {
        let songs = await getsongs();
        console.log(songs);
        let songsul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
        for(const song of songs){
            songsul.innerHTML=songsul.innerHTML + ` <li>
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div> ${song.replaceAll("%20", " ")} </div>
                <div>Shami</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        </li>`;
        }

        if (songs.length > 0) {
            // Set up a click event listener to play the audio when the user interacts with the document
            document.addEventListener("click", function playAudio() {
                var audio = new Audio(songs[0]);
                audio.play();

                audio.addEventListener("loadeddata", () => {
                    let duration = audio.duration;
                    console.log(duration);
                });

                // Remove the event listener to prevent multiple audio plays on subsequent clicks
                document.removeEventListener("click", playAudio);
            });
        } else {
            console.log("No songs found.");
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

main();
