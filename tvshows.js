import {Menu, getData, checkYear, requestTVShows} from './functions.js';

Menu();

let getYear;

//We'll define a variable called getYear to have access in it in the another callback
getData((Year_User) => {
    getYear = Year_User;
  }, 
  (Tvshow) => 
    {
      if(checkYear(getYear))
      {
          requestTVShows(getYear, Tvshow);
      }
      else
      {
          alert("Wrong Year");
      }
    }
  )


