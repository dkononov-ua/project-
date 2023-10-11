import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { serverPath } from 'src/app/shared/server-config';
import { SelectedFlatService } from './selected-flat.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  getFlats: any;
  selectedFlatId: any | null;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
  ) { }

  getData(): Observable<any> {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });
    const userJson = localStorage.getItem('user');
    let request: Observable<any>;

    if (userJson !== null) {
      if (this.selectedFlatId) {
        const flatinfo = serverPath + '/flatinfo/localflat';
        request = this.http.post(flatinfo, { auth: JSON.parse(userJson), flat_id: this.selectedFlatId });
      } else {
        console.log('house not found');
        request = of(null);
      }
    } else {
      console.log('user not found');
      request = of(null);
    }

    const userinfo = serverPath + '/userinfo';
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

  getComunalInfo(userJson: string, selectedFlatId: string, comunal_name: any): Observable<any> {
    return this.http.post(serverPath + '/comunal/get/button', { auth: JSON.parse(userJson), flat_id: selectedFlatId, comunal: comunal_name })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Failed to retrieve comunal info:', error.message);
          return of(null);
        })
      );
  }
}
