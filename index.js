// network, server request using axios  to fetch movie data //
const fetchData = async (searchTerm) => { // helper function
   const response = await axios.get('http://www.omdbapi.com/', {
      params: {
         apikey: '90d486a',
         s: searchTerm 
      }
   });
   console.log(response.data);
};

// selecting search input for event listener //
const input = document.querySelector('input');

const onInput = (event) => {
   fetchData(event.target.value);
}; 
// add eventListener
input.addEventListener('input', debounce(onInput, 500));

