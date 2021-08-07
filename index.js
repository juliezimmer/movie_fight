// network, server request using axios  to fetch movie data //
const fetchData = async () => { // helper function
   const response = await axios.get('http://www.omdbapi.com/', {
      params: {
         apikey: '90d486a',
         i: 'tt0848228' 
      }
   });
   console.log(response.data);
};

fetchData();

