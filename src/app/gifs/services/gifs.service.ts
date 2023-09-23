import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

//const GIPHY_API_KEY = 'OVBgsa15PEweVKQuGBgjYiWuM0lkv964';

@Injectable({providedIn: 'root'})
export class GifsService {
    public gifList: Gif[] = [];
    private _tagsHistory: string[] = [];
    private apiKey:       string = 'OVBgsa15PEweVKQuGBgjYiWuM0lkv964';
    private serviceURL:   string = 'https://api.giphy.com/v1/gifs';

    constructor( private http: HttpClient) {
        this.loadLocalStorage();
        console.log('Gifs Service Ready');
        
     }

    get tagsHistory() {
        return [...this._tagsHistory];
    }

    private organizeHistory (tag: string) {
        tag = tag.toLowerCase(); //pasamos en miniscula

        // Si el tag nuevo exite, solo los diferentes los dejamos pasar y otros lo eliminamos.
        if(this._tagsHistory.includes(tag)) {
            this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag)
        }

        // el nuevo tag lo situamos al inicio
        this._tagsHistory.unshift(tag);
        // solo mostramos 10 busquedas
        this._tagsHistory = this._tagsHistory.splice(0,10);
        this.saveLocalStorage();
    }

    private saveLocalStorage(): void{ //convertimos objeto en string
        localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    }

    private loadLocalStorage():void {
        if (!localStorage.getItem('history')) return;
        this._tagsHistory = JSON.parse(localStorage.getItem('history')! ); // ! siempre viene data

        //la primera busqueda debe mostrarse en la pantalla
        if(this._tagsHistory.length === 0) return; // si no hay ninguna busqueda.
        this.searchTag(this._tagsHistory[0]); // si hay mas de un elemento en la busqueda, busco la primera posicion 
    }

    /* async searchTag( tag:string ): Promise<void> {
        if (tag.length === 0) return;
        this.organizeHistory(tag);
       
        //peticion http - opcion 1
         fetch('https://api.giphy.com/v1/gifs/search?api_key=OVBgsa15PEweVKQuGBgjYiWuM0lkv964&q=valorant&limit=10')
        .then( resp => resp.json() )
        .then( data => console.log(data) );

        //opcion2 
         const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=OVBgsa15PEweVKQuGBgjYiWuM0lkv964&q=valorant&limit=10')
        const data = await resp.json();
        console.log(data);
    } */

    //opcion 3 - peticion http con el modulo de angular HTTclient = Observable(objeto que emite valores)
     searchTag( tag:string ): void {
        if (tag.length === 0) return;
        this.organizeHistory(tag); 

        //todos los query parameter los agregamos a un objeto llamado HttpParams
        const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', 10)
        .set('q', tag)

        //peticion http al api
        this.http.get<SearchResponse> (`${this.serviceURL}/search`, {params})
        .subscribe( resp => {
            this.gifList = resp.data;
        });
     }
    
}