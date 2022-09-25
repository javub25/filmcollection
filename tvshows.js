import {Menu, getYear, getGenre, checkYear, requestTVShows, evento_btnAnterior, evento_btnSiguiente} from './functions.js';

Menu();

getYear((Year_User) => {
    /*En caso de que el año sea correcto y aparte tenga un valor, cargamos las series con el año escogido.
    */
    if(checkYear(Year_User) && Year_User!==undefined)
    {
        //Obtendremos el genero cuando haya sido verificado el año
        getGenre((GenreId) => 
        {
            requestTVShows(Year_User, GenreId);
            evento_btnAnterior(Year_User, GenreId);
            evento_btnSiguiente(Year_User, GenreId);
        })
    }
    else
    {
        alert("Año incorrecto");
    }
});