import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'Ug2NxEK77DjBx87amXwVjt1dzqaEbTUx';
  private serviceUrl: string = ' https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('gifs service ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  /* La razón de devolver una copia en lugar del array original es mantener la encapsulación de datos y evitar que el array _tagsHistory sea modificado desde fuera de la clase. Al devolver una copia, cualquier modificación realizada en el array devuelto no afectará al array privado _tagsHistory. */

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this._tagsHistory.splice(0, 10);
    /* tambien puedo ponerlo asi
    this._tagsHistory= this.tagsHistory.splice(0,10) */
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]); // hace una busqueda con la primera posicion de array para asegurarse de que sea la tag mas reciente
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    /*.set('q', tag) = Por ejemplo, si llamas al método searchTag('cats'), se realizará una solicitud HTTP a la API de Giphy para buscar gifs relacionados con "cats", ya que el valor de tag es "cats". El parámetro "q" en la solicitud HTTP se establecerá como "cats", lo que indica que se desea buscar gifs relacionados con gatos. */

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params }) // realiza una solicitud HTTP GET al servicio de Giphy para buscar gifs.
      .subscribe((resp) => {
        this.gifsList = resp.data;
      });//subscribe recibe respuesta de solicitud http y la respuesta tiene que ser en formato searchresponse . resp data contiene la lista de gifs
  }
}
