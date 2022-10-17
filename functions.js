let page = 1;
const api_key = '91e2cd3a9a469c7556f0539d4e755dc3';
let total_pages;

//Evento que cargará la anterior página del catálogo de series basandose en el año y genero
export let evento_btnAnterior = (Year, Tvshow) =>
{
    const btnAnterior = document.querySelector("#btnAnterior");
    btnAnterior.addEventListener("click", () => 
    {
        if(page > 1)
        {
            page--;
            requestTVShows(Year, Tvshow);
        }
    })
}
//Evento que cargará la siguiente página del catálogo de series basandose en el año y genero
export let evento_btnSiguiente = (Year, Tvshow) =>
{
    const btnSiguiente = document.querySelector("#btnSiguiente");
    btnSiguiente.addEventListener("click", () => 
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

  //Mostramos el menú
  export const Menu = () =>
  {
      const menu = document.querySelector(".menu");
      const menu_apartados = document.createElement("div");
      const desplegable = document.querySelector(".material-symbols-outlined");
          
      //Mostramos el menú cuando se clique en el icono del desplegable
      desplegable.addEventListener("click", () =>
      {
        menu_apartados.innerHTML = `
          <div class="menu_apartados">
              <div>
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
          </div>
          `;

          menu.appendChild(menu_apartados);
  
          const cerrar = document.getElementsByClassName("menu_apartados")[0];
  
          cerrar.addEventListener("click", () =>
          {
              menu.removeChild(menu_apartados);
          });
      });
  }
  
//Comprovamos que el año sea correcto
export const checkYear = (Year) =>
{
    if(Year!=="")
    {
         //Expresion que comprueba que el año este entre 1900 y 2080
        let expr = new RegExp(/^(19|20)[\d]{2,2}$/);
        return expr.test(Year);
    }
    else return true;
}

//Peticion que nos saldrá los identificadores con cada uno de los nombres de cada genero
const requestgenresTVSHOWS = () => axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-eng`);


//Peticion que obtendremos las series a partir del año escojido o del genero
export async function requestTVShows(Year, Tvshow) 
{
    try
    { 
        let respuesta;

        if(Year === "" && Tvshow === "")
        {
            alert("You need to type one of the two fields");
        }
        else
        {
            if(Year === "" && Tvshow!== "")
            {
                respuesta = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${api_key}&language=en-eng&page=${page}&include_adult=false&query=${Tvshow}`);
            }
            else
            {
                if(Year!=="" && Tvshow === "")
                {
                    respuesta = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&first_air_date_year=${Year}&sort_by=first_air_date.desc&page=${page}&language=en-eng`);
                }
                else
                {
                    respuesta = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${api_key}&first_air_date_year=${Year}&language=en-eng&page=${page}&include_adult=false&query=${Tvshow}`);
                }
            }
        }
        
        if(respuesta.status === 200)
        {
            let datos = respuesta.data;
            //Obtenemos el numero total de paginas
            total_pages = datos.total_pages;

            //It has the goal to print buttons when user writes a query with more than one page
            let print_buttons = false;
            
            if(total_pages > 1)
            {
                const paginacion = document.querySelector(".paginacion");
                paginacion.innerHTML = `
                    <button id="btnAnterior">Previous</button>
		            <button id="btnSiguiente">Next</button>
                `;
                print_buttons = true;
            }
            else
            {
                const paginacion = document.querySelector(".paginacion");
                paginacion.innerHTML = "";
            }
            
            const contenedor = document.querySelector(".contenedor");

            let serie = '';
            //We're gonna show just tvshows from united states, spain, france and united kingdom
            const countries_available = ["US", "ES", "FR", "GB"];
            //it gonna return an object basing on countries codes
            datos.results.filter(tvshow =>
            {
                tvshow.origin_country.some(origin_country =>
                {
                    countries_available.map((code) => 
                    {
                        if(code === origin_country)
                        {
                            let TVshowMark, url, overview;
                            //Controlamos que si no existe ninguna imagen, añadamos una
                            if(tvshow.poster_path!==null) url = `https://image.tmdb.org/t/p/w500/${tvshow.poster_path}`;
                            else url = `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg`;
                        
                            //Si no existe ninguna sinopsis en el servicio se lo indicamos al usuario
                            if(tvshow.overview!=='') overview = tvshow.overview;
                            else overview = "We do not have a synopsis available.";
                        
                            //Si no existe ninguna nota
                            if(tvshow.vote_average === 0) TVshowMark = "Not defined";
                            else TVshowMark = tvshow.vote_average;
                        
                            //De forma asincrona extraeremos los nombres de los generos coincidiendo con sus respectivos numeros
                            requestgenresTVSHOWS()
                                .then(resolve => 
                                {
                                    if (resolve.status === 200)
                                    {
                                        let datos = resolve.data, genresName = [];

                                            tvshow.genre_ids.forEach((id) => 
                                            {
                                                datos.genres.forEach((genre) => 
                                                {
                                                    if(id === genre.id)
                                                    {
                                                        genresName.push(genre.name);
                                                    }
                                                })
                                            })

                                            try
                                            {
                                                serie+= 
                                                `
                                                <div>
                                                    <div>
                                                        <img src=${url} alt="" class="imagenPeli"/>
                                                    </div>
                                                    
                                                    <div class="textoPeli">
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
                                                            <span class="NotaPeli">${TVshowMark}</span>
                                                        </p>
                                                    </div>
                                                </div>   
                                                `
                                                contenedor.innerHTML = serie;
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
                evento_btnAnterior(Year, Tvshow);
                evento_btnSiguiente(Year, Tvshow);
            }
        }
        else if(respuesta.status === 404) throw new Error("Series not found");
        else if(respuesta.status === 401) throw new Error("Server unavailable");
        else throw new Error("Search Error");
    }
    catch(error)
    {
        console.error(error.message);
    }
}