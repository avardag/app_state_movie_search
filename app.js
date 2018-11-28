// vars
const app = document.querySelector("#app");
const form = document.querySelector("form");
const input = document.querySelector("#searchTerm");
const resultsSection = document.querySelector("#results");
const watchLaterSec = document.querySelector("#watch-later");

const API_KEY = '1054410c';
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=`;

/////////
//STATE
const state = {
  searchTerm: '',
  results: [],
  watchLater: [],
  error: ''
}

render(state)
//evt listener to track user input change
input.addEventListener("keyup", ()=>{
  state.searchTerm = input.value;
})

form.addEventListener("submit", formSubmitted )

async function formSubmitted(e) {
  e.preventDefault();

  try {
    state.results = await getResults(state.searchTerm)
    state.error = ''
  } catch (error) {
    state.results = []
    state.error = error.message
  }
  render(state)
}

async function getResults(q){
  const url = `${API_URL}${q}`;

  const response = await fetch(url)
  const data = await response.json()
  if (data.Error) {
    throw new Error(data.Error)
  }

  return data.Search
}

function buttonClicked(event){
    const movie = state.results.find(movie => {
      return movie.imdbID === event.target.dataset.movieid
    })
    if(!state.watchLater.includes(movie)){
      state.watchLater.push(movie)
    }
    render(state)
  }


function getMovieTemplate(mov, cols, button=true){
  return `
    <div class="card col-${cols}">
      <img class="card-img-top" src="${mov.Poster}" alt="${mov.Title}">
      <div class="card-body">
        <h5 class="card-title">${mov.Title}</h5>
        <p class="card-text">${mov.Year}</p>
        ${button ?
          `<button onclick="buttonClicked(event)" data-movieid="${mov.imdbID}" class="btn btn-danger watch-later-btn" type="button">
          Watch later
        </button>`
          : ""
        }
         
      </div>
    </div>
    `
}

//// RENDER FUNCTION
function render(state) {
  app.innerHTML = `
    <section class="row movies-area">
      <section id="results" class="row  col-9 mt-3">
        ${
          !state.error ?
            state.results.reduce((html, movie) => {
              return html + getMovieTemplate(movie, 4)
            }, "")
          : `
            <div class="alert alert-danger col" role="alert">
              ${state.error}
            </div>
          `
        }
      </section>
      <section class="row  col-3 mt-3">
        <h3>Watch later</h3>
        <section class="row" id="watch-later">
          ${
            
              state.watchLater.reduce((html, movie) => {
                return html + getMovieTemplate(movie, 12, false)
              }, "")
              
          }
        </section>
      </section>
    </section>
  `
}