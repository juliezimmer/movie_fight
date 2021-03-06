const createAutoComplete = ({ // destructured from config object in index.js //
   root, 
   renderOption, 
   onOptionSelect, 
   inputValue, 
   fetchData  
}) => {
   // HTML for autocomplete widget layout //
   root.innerHTML = `
      <label><b>Search</b></label> 
      <input class="input" >
      <div class="dropdown">
         <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
         </div>
      </div>
      `;

   // selecting search input for event listener //
   const input = root.querySelector('input'); 
   const dropdown = root.querySelector('.dropdown');
   const resultsWrapper = root.querySelector('.results');  // will wrap the rendered  item we are trying to show user //
   
   const onInput = async (event) => {
      const items = await fetchData(event.target.value);
      // checking if there is a movie(s) returned //
      if (!items.length) {
         dropdown.classList.remove('is-active');
         return;
      }  
      console.log(items);
      
      // clears movie results //
      resultsWrapper.innerHTML = '';
      // make dropdown active after data has been fetched from api //
      dropdown.classList.add('is-active');
      // iterate over returned movies //
      for(let item of items){
         // anchor elements created for the movie //
         const option = document.createElement('a');
         
         option.classList.add('dropdown-item');
         // set innerHTML
         option.innerHTML = renderOption(item);
         option.addEventListener('click', () => {
            // closes dropdown with items list //
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);
            onOptionSelect(item);
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
};