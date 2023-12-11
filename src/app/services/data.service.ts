import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { serverPath } from 'src/app/config/server-config';
import { SelectedFlatService } from './selected-flat.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  selectedFlatId: any | null;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
  ) { }

  getInfoUser(): Observable<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return this.http.post(serverPath + '/userinfo', JSON.parse(userJson))
        .pipe(
          tap((response: any) => {
            localStorage.setItem('userData', JSON.stringify(response));
          }),
          catchError((error: any) => {
            localStorage.removeItem('userData');
            return throwError('user not found');
          })
        );
    } else {
      return throwError('user not found');
    }
  }

  getInfoFlat(): Observable<any> {
    const userJson = localStorage.getItem('user');
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId || null;
    });

    if (userJson && this.selectedFlatId) {
      return this.http.post(serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .pipe(
          tap((response: any) => {
            // console.log(response)
            localStorage.setItem('houseData', JSON.stringify(response));
          }),
          catchError((error: any) => {
            localStorage.removeItem('houseData');
            return throwError('house not found');
          })
        );
    } else {
      return throwError('house not found');
    }
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
