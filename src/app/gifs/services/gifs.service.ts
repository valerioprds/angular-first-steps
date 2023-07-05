import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

public gifsList : Gif [] = []

  private _tagsHistory: string[] = [];
  private apiKey: string = 'Ug2NxEK77DjBx87amXwVjt1dzqaEbTUx';
  private serviceUrl : string = ' https://api.giphy.com/v1/gifs'

  constructor(private http: HttpClient) {}

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
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params  = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag)

    this.http
      .get<SearchResponse>(
        `${this.serviceUrl}/search`, { params }
      )
      .subscribe((resp) => {
        this.gifsList = resp.data

      });
  }
}