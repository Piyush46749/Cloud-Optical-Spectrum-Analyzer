import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { URL_CONFIG } from './app.config';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  setRequestHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  getRequestData(data) {
    return this.http
      .post<any>(URL_CONFIG.BASE_URL + URL_CONFIG.QUERY, data, this.setRequestHeaders())
      .pipe(
        map(this.extractData),
        catchError(this.handleError<any>('getDataForQuery'))
      );
  }

  getSingleTrace() {
    return this.http
      .get<any>(URL_CONFIG.BASE_URL + URL_CONFIG.TRACE, this.setRequestHeaders())
      .pipe(
        map(this.extractData),
        catchError(this.handleError<any>('getDataForSingleInstance'))
      );
  }

 

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}