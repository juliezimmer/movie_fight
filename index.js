// network, server request using axios  to fetch movie data //
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
}; 
// add eventListener
input.addEventListener('input', debounce(onInput, 500));

