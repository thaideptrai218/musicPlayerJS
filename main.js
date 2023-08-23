const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const app = {
    currentIndex: JSON.parse(localStorage.getItem("currentIndex")) || 0,
    isPlaying: false,
    isRandom: JSON.parse(localStorage.getItem("isRandom")),
    isRepeat: JSON.parse(localStorage.getItem("isRepeat")),
    songs: [
        {
            name: "Sequéncia da Dz7",
            singer: "TRASHXRL, Mc Menor Do Alvorada",
            path: "./music/music1.m4a",
            image: "./images/image1.jpg",
        },
        {
            name: "Brazilian Phonk Mano",
            singer: "Slowboy, lucaf, Crazy Mano",
            path: "./music/music2.mp3",
            image: "./images/image2.jpg",
        },
        {
            name: "Saka Saka Saka",
            singer: "MC Mazzie, DJ NpcSize, DJ Wizard",
            path: "./music/music3.mp3",
            image: "./images/image3.jpg",
        },
        {
            name: "MONTAGEM - PR FUNK",
            singer: "S3BZS, Mc Gw, Mc Menor Do Alvorada",
            path: "./music/music4.mp3",
            image: "./images/image4.jpg",
        },
        {
            name: "Kerosene",
            singer: "Crystal Castles",
            path: "./music/music5.mp3",
            image: "./images/image5.jpg",
        },
        {
            name: "Beat Trava Pulmäo",
            singer: "Toma Toma",
            path: "./music/music6.mp3",
            image: "./images/image6.jpg",
        },
        {
            name: "FRESH",
            singer: "NXVAMANE",
            path: "./music/music7.mp3",
            image: "./images/image7.jpg",
        },
    ],

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: () => this.songs[this.currentIndex],
        });
    },

    render: function () {
        playlist.innerHTML = this.songs
            .map((song, index) => {
                return `        
            <div class="song ${
                index === app.currentIndex ? "active" : ""
            }" data-index="${index}">
            <div
                class="thumb"
                style="
                    background-image: url('${song.image}');
                "
            ></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `;
            })
            .join("");
    },

    handleEvent: function () {
        const _this = this;
        // CD Rotating
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        // Scroll handler
        const cdWidth = cd.offsetWidth;
        document.addEventListener("scroll", function () {
            const newCDWidth = cdWidth - window.scrollY;
            cd.style.width = newCDWidth < 0 ? 0 : newCDWidth + "px";
            cd.style.opacity = newCDWidth < 0 ? 0 : newCDWidth / 200;
        });

        // Play handler
        playBtn.addEventListener("click", function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        });

        audio.addEventListener("play", function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        });

        audio.addEventListener("pause", function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        });

        audio.addEventListener("timeupdate", function () {
            const percentage = (this.currentTime / this.duration) * 100;
            progress.value = percentage || 0;
        });

        audio.addEventListener("ended", _this.handleEndSong);

        progress.addEventListener("click", function (e) {
            const percentage = (e.offsetX / this.offsetWidth) * 100;
            audio.currentTime = (audio.duration / 100) * percentage;
        });

        nextBtn.addEventListener("click", _this.nextSong);
        prevBtn.addEventListener("click", _this.prevSong);

        randomBtn.addEventListener("click", function () {
            _this.isRandom = !_this.isRandom;
            localStorage.setItem("isRandom", JSON.stringify(app.isRandom));
            this.classList.toggle("active");
        });

        repeatBtn.addEventListener("click", function () {
            _this.isRepeat = !_this.isRepeat;
            localStorage.setItem("isRepeat", JSON.stringify(app.isRepeat));
            this.classList.toggle("active");
        });

        playlist.addEventListener("click", function (e) {
            if (
                e.target.closest("div.song") &&
                !e.target.closest("div.option")
            ) {
                app.currentIndex = Number(
                    e.target.closest("div.song").dataset.index
                );
                localStorage.setItem(
                    "currentIndex",
                    JSON.stringify(app.currentIndex)
                );
                app.render();
                app.loadCurrentSong();
                audio.play();
            }
        });
    },

    loadCurrentSong: function () {
        heading.textContent = app.currentSong.name;
        cdThumb.style.backgroundImage = `url("${app.currentSong.image}")`;
        audio.src = app.currentSong.path;
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * app.songs.length);
        } while (newIndex === this.currentIndex);

        app.currentIndex = newIndex;
        localStorage.setItem("currentIndex", JSON.stringify(app.currentIndex));
        this.loadCurrentSong();
    },

    handleEndSong: function () {
        app.isRepeat ? audio.play() : app.nextSong();
    },

    nextSong: function () {
        if (app.isRandom) {
            app.playRandomSong();
            audio.play();
        } else {
            const totalSongs = app.songs.length - 1;
            app.currentIndex >= totalSongs
                ? (app.currentIndex = 0)
                : app.currentIndex++;
            localStorage.setItem(
                "currentIndex",
                JSON.stringify(app.currentIndex)
            );
            app.loadCurrentSong();
            audio.play();
        }
        app.render();
    },

    prevSong: function () {
        if (app.isRandom) {
            app.playRandomSong();
            audio.play();
        } else {
            const totalSongs = app.songs.length - 1;
            app.currentIndex <= 0
                ? (app.currentIndex = totalSongs)
                : app.currentIndex--;
            localStorage.setItem(
                "currentIndex",
                JSON.stringify(app.currentIndex)
            );
            app.loadCurrentSong();
            audio.play();
        }
        app.render();
    },

    start: function () {
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
        this.isRandom ? randomBtn.classList.add("active") : "";
        this.isRepeat ? repeatBtn.classList.add("active") : "";
    },
};

app.start();
console.log(audio);
/**s
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / Previous
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active songs
 * 9. Scroll active song into view
 * 10. Play songs when clicked
 */
