const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

// this will popup a alert if input is null otherwise 
// it will continue to search.
form.addEventListener("submit", e => {
    e.preventDefault();
    searchValue = search.value.trim();

    if (!searchValue) {
        alert("Nothing to search");
    } else {
        beginSearch(searchValue);
    }
})

// function for fetching requested value from api
async function beginSearch(searchValue) {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();

    displayData(data);
}
// for fetching songs lyrics from api
async function getLyrics(artist, songTitle) {
  const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await response.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <p>${lyrics}</p>`;

  more.innerHTML = '';
}

// function for displaying the fetched data from api
function displayData(data) {
    result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(song=> `<li>
                    <div>
                        <strong>${song.artist.name}</strong> -${song.title} 
                    </div>
                    <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</span>
                </li>`
        )
        .join('')}
    </ul>
  `;
  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<span class="btn" onclick="getMoreSongs('${data.prev}')">Prev</span>`
          : ''
      }
      ${
        data.next
          ? `<span class="btn" onclick="getMoreSongs('${data.next}')">Next</span>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}
// this function is for fetching more songs from api
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
  
    displayData(data);
  }

//event listener in get lyrics button
result.addEventListener('click', e=>{
    const clickedElement = e.target;

    //checking clicked elemet is button or not
    if (clickedElement.tagName === 'SPAN'){
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        
        getLyrics(artist, songTitle)
    }
})

