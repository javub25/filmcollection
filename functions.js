"use strict";

let page = 1;

export let evento_btnAnterior = (Year) =>
{
    const btnAnterior = document.querySelector("#btnAnterior");
    btnAnterior.addEventListener("click", () => 
    {
        if(page > 1)
        {
            page--;
            cargarSeries(Year);
        }
   
    })
}
export let evento_btnSiguiente = (Year) =>
{
    const btnSiguiente = document.querySelector("#btnSiguiente");
    btnSiguiente.addEventListener("click", () => 
    {
        if(page < 1000)
        {
            page++;
            cargarSeries(Year);
        }
    })
}

export const Menu = () =>
{
    const menu = document.querySelector(".menu");
    const menu_apartados = document.createElement("div");
    const desplegable = document.querySelector(".material-symbols-outlined");
        
    //Mostramos el menú cuando se clique en el icono del despleable
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

export async function cargarSeries(Year) 
{
    try
    { 
        //La API nos devolverá las series del año que eliga el usuario ordenadas de menor a mayor
        const respuesta = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=91e2cd3a9a469c7556f0539d4e755dc3&first_air_date_year=${Year}&sort_by=first_air_date.asc&page=${page}&language=es-ESP`);
        if(respuesta.status === 200)
        {
            let datos = respuesta.data;
            const contenedor = document.querySelector(".contenedor");
            
            let serie = '';
            datos.results.map((series) =>
                {
                    let getYear = series.first_air_date.slice(0,4);

                    if(getYear === Year)
                    {
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
        else if(respuesta.status === 404) 
            throw new Error("La pelicula no se encuentra");
        
        else if(respuesta.status === 401) 
            throw new Error("Servidor no disponible");

        else 
            throw new Error("Error de Busqueda");
    }
    catch(error)
    {
        console.error(error.message);
    }
}

export const getYear = () =>
{
    const button = document.querySelector(".button");

    button.addEventListener("click", () =>
    {
        const Formulario = document.querySelector(".FormFecha");
        const Year = new FormData(Formulario).get("Year");
        cargarSeries(Year);
        evento_btnAnterior(Year);
        evento_btnSiguiente(Year);
    })
}























