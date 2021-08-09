// server request using axios to fetch movie data //
const fetchData = async (searchTerm) => { // helper function
   const response = await axios.get('http://www.omdbapi.com/', {
      params: {
         apikey: '90d486a',
         s: searchTerm 
      }
   });
  return response.data.Search;
};

// selecting search input for event listener //
const input = document.querySelector('input'); 
 
const onInput = async (event) => {
   const movies = await fetchData(event.target.value);
   console.log(movies);
   // iterate over returned movies
   for(let movie of movies){
      // div for the movie information
      const div = document.createElement('div');
      // set innerHTML
      div.innerHTML = `
      <img src="${movie.Poster}" >
      <h1>${movie.Title}</h1>
      `;
      document.querySelector('#target').appendChild(div);
   }
}; 
// add eventListener
input.addEventListener('input', debounce(onInput, 500));

