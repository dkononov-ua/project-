import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    const houseJson = localStorage.getItem('house');
    const userJson = localStorage.getItem('user');

    // comunal/get/button

    let request: Observable<any>;

    if (userJson !== null) {
      if (houseJson) {
        const n = JSON.parse(houseJson);
        const flatinfo = 'http://localhost:3000/flatinfo/localflat';
        request = this.http.post(flatinfo, { auth: JSON.parse(userJson), flat_id: n.flat_id });
      } else {
        console.log('house not found');
        request = of(null);
      }
    } else {
      console.log('user not found');
      request = of(null);
    }

    const userinfo = 'http://localhost:3000/userinfo';
    const userRequest = this.http.post(userinfo, JSON.parse(userJson ?? 'null')).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Failed to retrieve user info:', error.message);
        return of(null);
      })
    );

    return forkJoin([request, userRequest]).pipe(
      map(([houseData, userData]) => {
        if (houseData === null) {
          return userData;
        } else {
          return {
            houseData: houseData,
            userData: userData,
          };
        }
      })
    );
  }
}


