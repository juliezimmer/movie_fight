// debounce helper function //
const debounce = (func, delay = 1000) => {
   let timeoutId; // id generated by setTimeout function //
   // this function returns a function. This is the wrapper/guard around onInput. Will guard how often func may be invoked. //
   return (...args) => {
      // check if timeoutId is defined
      if(timeoutId){
         clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
         func.apply(null, args);
      }, delay);
   };
};