let page = 1;
const api_key = '91e2cd3a9a469c7556f0539d4e755dc3';
let total_pages;

//Event that will load the previous page of Tvshows catalog based on the year and genre
export let Previousbtn_event = (Year, Tvshow) =>
{
    const Previousbtn = document.querySelector("#Previousbtn");
    Previousbtn.addEventListener("click", () => 
    {
        if(page > 1)
        {
            page--;
            requestTVShows(Year, Tvshow);
        }
    })
}
//Event that will load the next page of Tvshows catalog based on the year and genre
export let Nextbtn_event = (Year, Tvshow) =>
{
    const Nextbtn = document.querySelector("#Nextbtn");
    Nextbtn.addEventListener("click", () => 
    {
        if(page < total_pages)
        {
            page++;
            requestTVShows(Year, Tvshow);
        }
    })
}
export const getData = (Year_User, Tvshow) => {
    const button = document.querySelector(".button");
    button.addEventListener("click", () => {
        const Form = document.querySelector(".FormData");
        const Year = new FormData(Form).get("Year");
        const tvshow = new FormData(Form).get("Tvshow");
        Year_User(Year);
        Tvshow(tvshow);
    });
  }

  //We show the main menu
  export const Menu = () =>
  {
      //We access the drop-down menu (dropdown_hidden) to add it for mobile
      let dropdown_list = document.querySelector(".mobileView .dropdown_hidden");
      //We access the icon on the left of home to show the drop-down menu
      const dropdown_icon = document.querySelector(".mobileView .material-symbols-outlined");

      //Add whole drop-down menu just for mobile when user clicks above dropdown_icon
      dropdown_icon.addEventListener("click", () =>
        {
            dropdown_list.innerHTML = `          
              <div class="close">
                    <span class="material-symbols-outlined">
                    close
                    </span>
              </div>
              <div>
                  <a href="films.html" style="text-decoration:none; color:white">
                      <p>
                          MOVIES
                      </p>
                  </a>
              </div>
              <div>
                  <a href="tvshows.html" style="text-decoration:none; color:white">
                      <p>
                          TV SHOWS
                      </p>
                  </a>
              </div>
              <div>
                  <a href="genres.html" style="text-decoration:none; color:white">
                      <p>
                          GENRES
                      </p>
                  </a>
              </div>
          `;
            //As dropdown menu will be visible we need to remove property display:none from dropdown_hidden class
            dropdown_list.classList.remove("dropdown_hidden");
            //We add display:block property from dropdown_visible and the effect called animate_backInDown
            dropdown_list.classList.add('dropdown_visible', 'animate__animated', 'animate__backInDown', 'animate__fast');

            //We access to the cross icon to know when user wants to close dropdown menu
            const close_icon = document.querySelector(".close");
            close_icon.addEventListener("click", () => 
            {
                //When user does a click it means we'll hid dropdown list from mobile and it'll add animate class called animate_backInDown
                dropdown_list.classList.add("dropdown_hidden");
                dropdown_list.classList.remove('dropdown_visible','animate__animated', 'animate__backInDown', 'animate__fast');
            })
        });     
  }
  
//Let's check that the year is correct
export const checkYear = (Year) =>
{
    if(Year!=="")
    {
         //Expression that checks that the year is between 1900 and 2080
        let expr = new RegExp(/^(19|20)[\d]{2,2}$/);
        return expr.test(Year);
    }
    else return true;
}

//Request that will give us the identifiers with each of the names of each gender
const requestgenresTVSHOWS = () => axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-eng`);


//Request that we will obtain tvshows from year chosen or gender
export async function requestTVShows(Year, Tvshow) 
{
    try
    { 
        let respuesta;

        //When user doesn't specify year neither tvshow
        if(Year === "" && Tvshow === "")
        {
            alert("You need to type one of the two fields");
        }
        else
        {
            //When user only specify Tvshow
            if(Year === "" && Tvshow!== "")
            {
                respuesta = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${api_key}&language=en-eng&page=${page}&include_adult=false&query=${Tvshow}`);
            }
            else
            {
                //When user only specify Year
                if(Year!=="" && Tvshow === "")
                {
                    respuesta = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&first_air_date_year=${Year}&sort_by=first_air_date.desc&page=${page}&language=en-eng`);
                }
                //When user specify both
                else
                {
                    respuesta = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${api_key}&first_air_date_year=${Year}&language=en-eng&page=${page}&include_adult=false&query=${Tvshow}`);
                }
            }
        }

        if(respuesta.status === 200)
        {
            //It stores whole results of request
            let datos = respuesta.data;
            //Get the total number of pages regarding request results
            total_pages = datos.total_pages;

            //It has the goal to print buttons when user writes a query with more than one page
            let print_buttons = false;
            
            //We're gonna access to id buttons to manage when results returns one or more than one page
            const buttons = document.querySelector("#buttons");

            //When the next animate class exists will remove it
            if(buttons.classList.contains("animate__fadeOutDown"))
            {
                buttons.classList.remove('animate__fadeOutDown');
            }
            //In the case that the request has returned with more than one page, we will show the pagination buttons 
            if(total_pages > 1)
            {
                buttons.classList.add('showButtons', 'animate__animated', 'animate__fadeInUp');
                buttons.classList.remove("buttons_hidden");
                buttons.innerHTML = `
                    <button id="Previousbtn">Previous</button>
		            <button id="Nextbtn">Next</button>
                `;
                print_buttons = true;
            }
            //In the case that the request has returned one page, we will hid them 
            else
            {
                if(buttons.classList.contains("showButtons"))
                {
                    buttons.innerHTML = "";
                    buttons.classList.add('buttons_hidden', 'animate__fadeOutDown');
                    buttons.classList.remove('animate__fadeInUp');
                }
            }
            //Variable that will show all tvshows in html
            const tvshowsContainer = document.querySelector(".tvshowsContainer");
            let show = '';
            //We're gonna show just tvshows from united states, spain, france and united kingdom
            const countries_available = ["US", "ES", "FR", "GB"];
            //it gonna return an object basing on countries codes
            datos.results.filter(tvshow =>
            {
                //It gonna look for tvshows basing on countries_available array
                tvshow.origin_country.some(origin_country =>
                {
                    countries_available.map((code) => 
                    {
                        //We add tvshows data from countries chosen
                        if(code === origin_country)
                        {
                            let TVshowMark, url, overview;
                            //We control that if there is no image, we add one
                            if(tvshow.poster_path!==null) url = `https://image.tmdb.org/t/p/w500/${tvshow.poster_path}`;
                            else url = `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg`;
                        
                            //If there is no synopsis in the service, we indicate it to the user
                            if(tvshow.overview!=='') overview = tvshow.overview;
                            else overview = "We do not have a synopsis available.";
                        
                            //If there is no mark
                            if(tvshow.vote_average === 0) TVshowMark = "Not defined";
                            else TVshowMark = tvshow.vote_average;

                            //We call genres function to show each genre name
                            requestgenresTVSHOWS()
                                .then(resolve => 
                                {
                                    if (resolve.status === 200)
                                    {
                                        let datos = resolve.data, genresName = [];

                                            tvshow.genre_ids.forEach((id) => 
                                            {
                                               //we will store the names of the genres matching their respective ids
                                                datos.genres.forEach((genre) => 
                                                {
                                                    if(id === genre.id)
                                                    {
                                                        genresName.push(genre.name);
                                                    }
                                                })
                                            })

                                            //We'll obtain data from each Tvshow object 
                                            try
                                            {
                                                show+= 
                                                `
                                                <div>
                                                    <div>
                                                        <img src=${url} alt="" class="image"/>
                                                    </div>
                                                    
                                                    <div class="block_synopsis">
                                                        <h3>
                                                            ${tvshow.original_name}
                                                        </h3>
                                                        <p>
                                                            ${tvshow.first_air_date}
                                                            <br/><br/>
                                                            ${overview}
                                                            <br/><br/>
                                                            ${genresName}
                                                            <br/><br/>
                                                            <span class="MarkMovie">${TVshowMark}</span>
                                                        </p>
                                                        
                                                    </div>
                                                </div>   
                                                `
                                                tvshowsContainer.innerHTML = show;
                                            }
                                            catch(error)
                                            {
                                                console.error(error.message);
                                            }     
                                        }
                                    })
                                    .catch(error => 
                                    {
                                        console.log(error);
                                    })
                                
                                }
                            })
                        })
                });
            if(print_buttons === true)
            {
                Previousbtn_event(Year, Tvshow);
                Nextbtn_event(Year, Tvshow);
            }
        }
        else if(respuesta.status === 404) throw new Error("Tvshows not found");
        else if(respuesta.status === 401) throw new Error("Server unavailable");
        else throw new Error("Search Error");
    }
    catch(error)
    {
        console.error(error.message);
    }
}