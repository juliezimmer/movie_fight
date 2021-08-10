// server request using axios to fetch movie data //
const fetchData = async (searchTerm) => { // helper function
   const response = await axios.get('http://www.omdbapi.com/', {
      params: {
         apikey: '90d486a',
         s: searchTerm 
      }
   });
   if(response.data.Error){
      return [];
   }
  return response.data.Search;
};

const root = document.querySelector('.autocomplete');
// HTML for autocomplete widget //
root.innerHTML = `
   <label><b>Search For a Movie</b></label> 
   <input class="input" >
   <div class="dropdown">
      <div class="dropdown-menu">
         <div class="dropdown-content results"></div>
      </div>
   </div>
   `;

// selecting search input for event listener //
const input = document.querySelector('input'); 
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');  // will wrap the rendered  movie we are trying to show user //
 
const onInput = async (event) => {
   const movies = await fetchData(event.target.value);
   if (!movies.length) {
      dropdown.classList.remove('is-active');
      return;
   }  
   console.log(movies);
   
   // clears movie results //
   resultsWrapper.innerHTML = '';
   // make dropdown active after data has been fetched from api //
   dropdown.classList.add('is-active');
   // iterate over returned movies //
   for(let movie of movies){
      // anchor elements created for the movie //
      const option = document.createElement('a');
      // using a ternary operator to check for movie poster 
      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

      option.classList.add('dropdown-item');
      // set innerHTML
      option.innerHTML = `
         <img src="${imgSrc}" >
         ${movie.Title}
      `;
      option.addEventListener('click', () => {
         // closes dropdown with movies list //
         dropdown.classList.remove('is-active');
         input.value = movie.Title;
         onMovieSelect(movie);
      });
      resultsWrapper.appendChild(option);
   }
}; 
// add eventListener
input.addEventListener('input', debounce(onInput, 1000));

// adding global event Listener to entire document //
// closes dropdown //
document.addEventListener('click', (event) => {
   if(!root.contains(event.target)){
      dropdown.classList.remove('is-active');   
   }
});

// when the user selects a movie from the dropdown //
const onMovieSelect = async movie => {
   const response = await axios.get('http://www.omdbapi.com/', {
      params: {
         apikey: '90d486a',
         i: movie.imdbID
      }
   });
   
   document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
   return `
      <article class="media">
         <figure class="media-left">
            <p class="image">
               <img src="${movieDetail.Poster}" >
            </p>
         </figure>
         <div class="media-content">
            <div class="content">
               <h1>${movieDetail.Title}</h1>
               <h4>${movieDetail.Genre}</h4>
               <p>${movieDetail.Plot}</p>
            </div>
         </div>
      </article>
      <article class="notification is-primary">
         <p class="title">${movieDetail.Awards}</p>
         <p class="subtitle">Awards</p>
      </article>
      <article class="notification is-primary">
         <p class="title">${movieDetail.BoxOffice}</p>
         <p class="subtitle">Box Office</p>
      </article>
      <article class="notification is-primary">
         <p class="title">${movieDetail.Metascore}</p>
         <p class="subtitle">Metascore</p>
      </article>
      <article class="notification is-primary">
         <p class="title">${movieDetail.imdbRating}</p>
         <p class="subtitle">IMDB Rating</p>
      </article>
      <article class="notification is-primary">
         <p class="title">${movieDetail.imdbVotes}</p>
         <p class="subtitle">IMDB Votes</p>
      </article>
   `;
};