let progress = document.getElementById("progress");
let song = document.getElementById("song");
let ctrlIcon = document.getElementById("ctrlIcon");
let seekSlider = document.querySelector(".seekSlider");
let currTime = document.querySelector(".currentTime");
let totalDuration = document.querySelector(".totalDuration");

song.onloadedmetadata = function(){
    progress.max = song.duration;
    progress.value = song.currentTime;
}

// CONTROL BUTTONS
function playPause(){
    if(ctrlIcon.classList.contains("fa-pause")){
        song.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");
    }
    else{
        song.play();
        ctrlIcon.classList.add("fa-pause");
        ctrlIcon.classList.remove("fa-play");
    }
}

if(song.play()){
    setInterval(()=>{
        progress.value = song.currentTime
    },500);
}

progress.onchange = function(){
    song.play();
    song.currentTime = progress.value;
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
}


song.addEventListener('timeupdate', () => {
    let currentTime = song.currentTime;
    let duration = song.duration;

    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    let durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);

    if (currentSeconds < 10) {
        currentSeconds = '0' + currentSeconds;
    }
    if (durationSeconds < 10) {
        durationSeconds = '0' + durationSeconds;
    }

    currTime.textContent = `${currentMinutes}:${currentSeconds}`;
    totalDuration.textContent = `${durationMinutes}:${durationSeconds}`;
});






/*** API Integration ****/




const contentHolder = {
    lyrics: "",
    albums: "",
    artists: "",
    
};

function showContent(tab) {
    console.log(tab)
    // const contHolder = document.getElementsByClassName("content-holder")[0]; // Note the correction here (getElement**s**ByClassName)
    
    // for album
    const contentHolder = document.querySelector('.content-holder');
    // console.log({contHolder})
    const test = {
        text: "<p>TEST</p>"
    }
    if (tab === 'lyrics') {
        fetchLyrics();
    }
    if (tab === 'albums') {
        fetchAlbums();
    }
    if (tab === 'artists') {
        fetchArtists();
    }  

    
}

// Lyrics API

async function fetchLyrics() {

    const url = 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=7076626';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '53071e078dmsh63019c0f7863f94p1e2e15jsne8127a51c4cf',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
      }
    };
  
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        console.log(result.lyrics.lyrics.body) 
    
        // Display the lyrics on the page
        const contentHolder = document.querySelector('.content-holder');
        contentHolder.innerHTML = result.lyrics.lyrics.body.html;
      } catch (error) {
        console.error(error);
      }
}

    // Albums API

    // async function fetchAlbums() {

        
    //     const url = 'https://spotify23.p.rapidapi.com/artist_albums/?id=06HL4z0CvFAxyc27GXpf02&offset=0&limit=25';
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             'X-RapidAPI-Key': '53071e078dmsh63019c0f7863f94p1e2e15jsne8127a51c4cf',
    //             'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    //         }
    //     };
    
    //     try {
    //         const response = await fetch(url, options);
    //         const result = await response.json();
    //         const albums = result.data.artist.discography.albums.items;
            
    //         contentHolder.innerHTML = '';
    //         albums.forEach(album => {
    //             const release = album.releases.items[0];
    //             const name = release.name;
    //             const year = release.date.year;
    //             const coverArtUrl = release.coverArt.sources[0].url;
    //             const shareUrl = release.sharingInfo.shareUrl;
    //             contentHolder.innerHTML += `
    //                 <div>
    //                     <img src="${coverArtUrl}" alt="${name}">
    //                     <h3>${name}</h3>
    //                     <p>${year}</p>
    //                     <a href="${shareUrl}">Share</a>
    //                 </div>
    //             `;
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    
    // fetchAlbums();

    
// Artist API

async function fetchArtists() {
    const url = 'https://spotify23.p.rapidapi.com/artist_related/?id=06HL4z0CvFAxyc27GXpf02';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '53071e078dmsh63019c0f7863f94p1e2e15jsne8127a51c4cf',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const artists = result.artists;
        let artistList = '';
        artists.forEach(artist => {
            const imageUrl = artist.images[0].url;
            const name = artist.name;
            artistList += `
                <div class="flex flex-col px-10 py-10">
                    <img class="max-w-none w-80 h-[295px]" src="${imageUrl}" alt="${name}">
                    <h3 class="text-3xl pt-8">${name}</h3>
                </div>
            `;
        });
        document.querySelector('.content-holder').innerHTML = artistList;
    } catch (error) {
        console.error(error);
    }
}

fetchArtists();








// Call fetchLyrics function somewhere in your code to fetch the lyrics.







// async function fetchData() {
        
//     const url = 'https://spotify23.p.rapidapi.com/artist_albums/?id=06HL4z0CvFAxyc27GXpf02&offset=0&limit=25';
//     const options = {
//         method: 'GET',
//         headers: {
//             'X-RapidAPI-Key': '53071e078dmsh63019c0f7863f94p1e2e15jsne8127a51c4cf',
//             'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
//         }
//     };

//     try {
//         const response = await fetch(url, options);
//         const data = await response.json();
//         fetchAlbums(data);
//     } catch (error) {
//         console.error(error);
//     }
// }

// function fetchAlbums(data) {
//     const contentHolder = document.querySelector('.content-holder');
//     const items = data.artist.discography.albums.items.release.items;

//     let html = '';

//     for (const item of items) {
//         for (const release of item.releases.items) {
//             const coverArtUrl = release.coverArt.sources[0].url;
//             const name = release.name;
//             const year = release.date.year;

//             html += `
//                 <div>
//                     <img src="${coverArtUrl}" alt="${name}">
//                     <h3>${name}</h3>
//                     <p>${year}</p>
//                 </div>
//             `;
//         }
//     }

//     contentHolder.innerHTML = html;
// }