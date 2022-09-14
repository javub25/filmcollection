let page = 1;
const api_key = '91e2cd3a9a469c7556f0539d4e755dc3';

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
        if(page < 1000)
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


async function requestgenresTVSHOWS(genres, series)
{
    let respuesta = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)
    
    if (respuesta.status === 200)
    {
        let datos = respuesta.data;

        series.genre_ids.forEach((genero_id) => 
        {
            datos.genres.forEach((genero) => 
            {
                if(genero_id === genero.id)
                {
                    genres.push(genero.name);
                    console.log(genres);
                }
            })
            
        })
    } 
}
export async function requestTVShows(Year) 
{
    try
    { 
        //La API nos devolverá las series del año que eliga el usuario ordenadas de menor a mayor
        const respuesta = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&first_air_date_year=${Year}&sort_by=first_air_date.desc&page=${page}&language=es-ESP`);
        if(respuesta.status === 200)
        {
            let datos = respuesta.data;
            const contenedor = document.querySelector(".contenedor");

            let serie = '';

            datos.results.map((series) =>
            {
                //Obtenemos los últimos 4 digitos del año de cada serie, para mostrar únicamente los del año que ponga el usuario
                let getYear = series.first_air_date.slice(0,4);
                
                    if(getYear === Year)
                    {
                        let genres = [];
                        requestgenresTVSHOWS(genres, series);

                        //console.log(genres);

                        try
                        {
                            serie+= 
                            `
                            <div>
                                <div>
                                    <img src=https://image.tmdb.org/t/p/w500/${series.poster_path} alt="" class="imagenPeli"/>
                                </div>
                                <div class="textoPeli">
                                    <h3>
                                        ${series.name}
                                    </h3>
        
                                    <p>
                                         ${series.first_air_date}
                                        <br/><br/>
                                        ${series.overview}
                                        <br/><br/>
                                       
                                        Nota general: <span class="NotaPeli">${series.vote_average}</span>
                                    </p>
                                </div>
                            </div>   
                        `
                        contenedor.innerHTML = serie;
                            if(series.poster_path === null)
                            {
                                throw new Error(`La imagen no fue añadida en ${series.name}`);
                            }  
                        }
                        catch(error)
                        {
                            console.error(error.message);
                        }  
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




