// vars
const form = document.querySelector("form");
const input = document.querySelector("#searchTerm");
const resultsSection = document.querySelector("#results");
const watchLaterSec = document.querySelector("#watch-later");

const API_KEY = '1054410c';
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=`;


form.addEventListener("submit", formSubmitted )

async function formSubmitted(e) {
  e.preventDefault();
  
  const searchTerm = input.value;

  try {
    const results = await getResults(searchTerm)
    showResults(results);
  } catch (error) {
    showError(error)
  }
  
}
// function formSubmitted(e) {
//   const searchTerm = input.value;

//   getResults(searchTerm)
//   .then(showResults)

//   e.preventDefault();
// }
async function getResults(q){
  const url = `${API_URL}${q}`;

  const response = await fetch(url)
  const data = await response.json()
  if (data.Error) {
    throw new Error(data.Error)
  }

  return data.Search
}
// function getResults(q){
//   const url = `${API_URL}${q}`;

//   return fetch(url)
//   .then(res => res.json())
//   .then(data => data.Search)
// }
function showResults(results) {
  resultsSection.innerHTML = '';
  let html = results.reduce((html, movie) => {
    return html + getMovieTemplate(movie, 4)
  }, "")
  
  resultsSection.innerHTML = html;

  const watchLaterButtons = document.querySelectorAll(".watch-later-btn");
  watchLaterButtons.forEach(btn => {
    btn.addEventListener("click", (event)=>{
      const movie = results.find(movie => {
        return movie.imdbID === btn.dataset.movieid
      })
      watchLaterSec.innerHTML += getMovieTemplate(movie, 12, false)
      
      
    })
  })
}

function showError(err) {
  resultsSection.innerHTML = `
    <div class="alert alert-danger col" role="alert">
      ${err.message}
    </div>
  `
}

function getMovieTemplate(mov, cols, button=true){
  return `
    <div class="card col-${cols}">
      <img class="card-img-top" src="${mov.Poster}" alt="${mov.Title}">
      <div class="card-body">
        <h5 class="card-title">${mov.Title}</h5>
        <p class="card-text">${mov.Year}</p>
        ${button ?
          `<button data-movieid="${mov.imdbID}" class="btn btn-danger watch-later-btn" type="button">` 
          : ""
        }
         Watch later
        </button>
      </div>
    </div>
    `
}