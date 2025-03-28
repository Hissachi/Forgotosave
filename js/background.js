const backgrounds = [
    "url('https://c4.wallpaperflare.com/wallpaper/779/824/841/pixel-art-8-bit-wallpaper-preview.jpg')",
    "url('https://c4.wallpaperflare.com/wallpaper/1023/237/149/pixelated-pixel-art-pixels-8-bit-wallpaper-preview.jpg')",
    "url('https://c4.wallpaperflare.com/wallpaper/992/754/421/pixel-art-8-bit-retro-games-wallpaper-preview.jpg')",
    "url('https://c4.wallpaperflare.com/wallpaper/690/675/807/digital-art-space-universe-pixels-wallpaper-preview.jpg')",
    "url('https://c4.wallpaperflare.com/wallpaper/526/190/355/night-the-city-building-pixels-wallpaper-preview.jpg')",
    "url('https://c4.wallpaperflare.com/wallpaper/194/796/848/shovel-knight-video-games-pixel-art-retro-games-wallpaper-preview.jpg')"
];

const changeTime = 10000
let currentIndex = 0

function changeBackground (){
    document.body.style.background = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), ${backgrounds[currentIndex]} no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";
    currentIndex = (currentIndex + 1) % backgrounds.length;
}

changeBackground()
setInterval(changeBackground, changeTime)

window.onload = function() {
backgrounds.forEach(bg => {
    const img = new Image()
            img.src = bg.match(/url\('(.*)'\)/)[1]
    });
};