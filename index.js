const autoCompleteConfig = {
   renderOption (movie){
      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
      return `
         <img src="${imgSrc}" >
         ${movie.Title} (${movie.Year})
      `;
   },
   inputValue(movie){
      return movie.Title;
   },
   async fetchData(searchTerm) { 
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
   }
};

// config object as parameter // 
// calling createAutoComplete to setup widgets //
createAutoComplete({
   ...autoCompleteConfig,
   root: document.querySelector('#left-autocomplete'),
   onOptionSelect(movie){
      // hides tutorial on screen when movie selected //
      document.querySelector('.tutorial').classList.add('is-hidden');
      // 2nd parameter is where to render the summary //
      onMovieSelect(movie, document.querySelector('#left-summary'),'left');
   }
});
createAutoComplete({
   ...autoCompleteConfig,
   root: document.querySelector('#right-autocomplete'),
   onOptionSelect(movie){
      // hides tutorial on screen when movie selected //
      document.querySelector('.tutorial').classList.add('is-hidden');
      // 2nd parameter is where to render the summary //
      onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
   }
});

let leftMovie;
let rightMovie;
// when the user selects a movie from the dropdown //
const onMovieSelect = async (movie, summaryElement, side) => {
   const response = await axios.get('http://www.omdbapi.com/', {
      params: {
         apikey: '90d486a',
         i: movie.imdbID
      }
   });
   
   summaryElement.innerHTML = movieTemplate(response.data);
   if (side === 'left'){
      leftMovie = response.data;
   } else {
      rightMovie = response.data;
   }
   // checks that both movies are defined //
   if (leftMovie && rightMovie){
      runComparison();
   }
};

// compares the movie stats side by side
const runComparison = () => {
   const leftSideStats = document.querySelectorAll('#left-summary .notification');
   const rightSideStats = document.querySelectorAll('#right-summary .notification');

   // iterate over each value
   leftSideStats.forEach((leftStat, index) => {
      const rightStat = rightSideStats[index];

      const leftSideValue = parseFloat(leftStat.dataset.value); 
      const rightSideValue = parseFloat(rightStat.dataset.value);

      if (rightSideValue > leftSideValue){
         leftStat.classList.remove('is-primary'); // from Bulma
         leftStat.classList.add('is-warning'); // from Bulma
      } else {
         rightStat.classList.remove('is-primary');
         rightStat.classList.add('is-warning');
      }
   });
}
const movieTemplate = (movieDetail) => {
   const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
   const metascore = parseInt(movieDetail.Metascore);
   const imdbRating = parseFloat(movieDetail.imdbRating);
   const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
   console.log(imdbVotes);
  
   const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
      const value = parseInt(word); // returns NaN if it is a word
      // checks whether value is a word or number
      if (isNaN(value)) {
         return prev;
      } else {
         return prev + value;
      }
   }, 0);
  
   
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
      <article data-value=${awards} class="notification is-primary">
         <p class="title">${movieDetail.Awards}</p>
         <p class="subtitle">Awards</p>
      </article>
      <article data-value=${dollars} class="notification is-primary">
         <p class="title">${movieDetail.BoxOffice}</p>
         <p class="subtitle">Box Office</p>
      </article>
      <article data-value=${metascore} class="notification is-primary">
         <p class="title">${movieDetail.Metascore}</p>
         <p class="subtitle">Metascore</p>
      </article>
      <article data-value=${imdbRating} class="notification is-primary">
         <p class="title">${movieDetail.imdbRating}</p>
         <p class="subtitle">IMDB Rating</p>
      </article>
      <article data-value=${imdbVotes} class="notification is-primary">
         <p class="title">${movieDetail.imdbVotes}</p>
         <p class="subtitle">IMDB Votes</p>
      </article>
   `;
};