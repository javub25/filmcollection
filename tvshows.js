import {getYear, checkYear, requestTVShows, evento_btnAnterior, evento_btnSiguiente} from './functions.js';

getYear(Year_User => {
    /*En caso de que el año sea correcto y aparte tenga un valor, cargamos las series con el año escogido.
    */
    if(checkYear(Year_User) && Year_User!==undefined)
    {
        requestTVShows(Year_User);
        evento_btnAnterior(Year_User);
        evento_btnSiguiente(Year_User);
    }
    else alert("Año incorrecto");
})


