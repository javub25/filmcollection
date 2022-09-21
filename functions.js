let page = 1;
const api_key = '91e2cd3a9a469c7556f0539d4e755dc3';
let total_pages;

export let evento_btnAnterior = (Year) =>
{
    const btnAnterior = document.querySelector("#btnAnterior");
    btnAnterior.addEventListener("click", () => 
    {
        if(page > 1)
        {
            page--;
            requestTVShows(Year);
        }
    })
}
//Evento que cargará la siguiente página del catálogo de series
export let evento_btnSiguiente = (Year) =>
{
    const btnSiguiente = document.querySelector("#btnSiguiente");
    btnSiguiente.addEventListener("click", () => 
    {
        if(page < total_pages)
        {
            page++;
            requestTVShows(Year);
        }
    })
}
//Obtenemos el año que el usuario escriba a partir del evento
export const getYear = Year_User => {
    const button = document.querySelector(".button");
    button.addEventListener("click", () => {
        const Formulario = document.querySelector(".FormFecha");
        const Year = new FormData(Formulario).get("Year");
        Year_User(Year);
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
                  <div>
                      <span class="material-symbols-outlined">
                      close
                      </span>
                  </div>
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
    //Expresion que comprueba que el año este entre 1900 y 2080
    let expr = new RegExp(/^(19|20)[\d]{2,2}$/);

    return expr.test(Year);
}

//Peticion que nos saldrá los identificadores con cada uno de los nombres de cada genero
const requestgenresTVSHOWS = () => axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=es-ES`);

//Mostrará un menú con la suma total de generos según el año escojido
let TotalGenres = [];

let showTotalGenres = (genres, TotalGenres) =>
{
    /*Cada vez que se vayan añadiendo nombres de generos en la lista genres lo añadiremos en un listado de objetos
    para aparte de tener el nombre guardar las veces que aparece cada genero*/
    genres.forEach((genres_name) => 
    {
        let found = false;

        TotalGenres.find((new_genre) => 
        {
            //Iremos sumando cuando el genero exista
            if(genres_name === new_genre.genre) 
            {
                new_genre.count++;
                found = true;
            }
        })

        //En caso de que el genero no este en el objeto, lo vamos añadir con una apariencia de 1
        if(found === false)
        {
            TotalGenres.push({
                genre: genres_name,
                count: 1
            })
        }
    })
}

export async function requestTVShows(Year) 
{
    try
    { 
        //La API nos devolverá las series del año que eliga el usuario ordenadas de menor a mayor
        const respuesta = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&first_air_date_year=${Year}&sort_by=first_air_date.desc&page=${page}&language=es-ES`);
        if(respuesta.status === 200)
        {
            let datos = respuesta.data;
            //Obtenemos el numero total de paginas
            total_pages = datos.total_pages;
            const contenedor = document.querySelector(".contenedor");

            let serie = '';

            datos.results.map((series) =>
            {
                    //Obtenemos los últimos 4 digitos del año de cada serie, para mostrar únicamente los del año que ponga el usuario
                    let getYear = series.first_air_date.slice(0,4);
                  
                    if(getYear === Year)
                    {
                        let TVshowMark, url, overview;

                        //Controlamos que si no existe ninguna imagen, añadamos una
                        if(series.poster_path!==null) url = `https://image.tmdb.org/t/p/w500/${series.poster_path}`;
                        else url = `https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg`;
                        
                        //Si no existe ninguna sinopsis en el servicio se lo indicamos al usuario
                        if(series.overview!=='') overview = series.overview;
                        else overview = "No tenemos una sinopsis disponible.";
                        
                        //Si no existe ninguna nota
                        if(series.vote_average === 0) TVshowMark = "No definida";
                        else TVshowMark = series.vote_average;
                        
                        //De forma asincrona extraeremos los nombres de los generos coincidiendo con sus respectivos numeros
                        requestgenresTVSHOWS()
                        .then(resolve => {
                            if (resolve.status === 200)
                            {
                                let datos = resolve.data, genres = [];

                                series.genre_ids.forEach((genero_id) => 
                                {
                                    datos.genres.forEach((genero) => 
                                    {
                                        if(genero_id === genero.id)
                                        {
                                            genres.push(genero.name); 
                                        }
                                    })
                                })
                                //Funcion que guardará en la lista TotalGenres cuantas veces se repite cada genero en cada página
                                showTotalGenres(genres, TotalGenres);
                                
                                console.log(TotalGenres);

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
                                                ${series.name}
                                            </h3>
                                            <p>
                                                 ${series.first_air_date}
                                                <br/><br/>
                                                ${overview}
                                                <br/><br/>
                                                ${genres}
                                                <br/><br/>
                                                Nota: <span class="NotaPeli">${TVshowMark}</span>
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
                }
            )
        }
        else if(respuesta.status === 404) throw new Error("La pelicula no se encuentra");
        else if(respuesta.status === 401) throw new Error("Servidor no disponible");
        else throw new Error("Error de Busqueda");
    }
    catch(error)
    {
        console.error(error.message);
    }
}