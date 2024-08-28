import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import * as ServerConfig from 'src/app/config/path-config';
import { SelectedFlatService } from './selected-flat.service';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  selectedFlatId: any | null;
  serverPath: string = '';

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private selectedFlatService: SelectedFlatService,
  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      // console.log(this.serverPath)
    })
  }

  getInfoUser(): Observable<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return this.http.post(this.serverPath + '/userinfo', JSON.parse(userJson))
        .pipe(
          tap((response: any) => {
            // console.log(response)
            if (response && response.status === true) {
              // console.log(response)
              localStorage.setItem('userData', JSON.stringify(response));
              this.getFeaturesInfo();
            }
            else {
              this.sharedService.logout();
            }
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

  // Пошукові параметри користувача
  async getFeaturesInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/features/get', { auth: JSON.parse(userJson) }).toPromise();
        // console.log(response)
        if (response.status === true) {
          localStorage.setItem('searchInfoUserData', JSON.stringify(response.inf));
        } else {
          localStorage.removeItem('searchInfoUserData');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  getInfoFlat(): Observable<any> {
    const userJson = localStorage.getItem('user');
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId || null;
    });

    if (userJson && this.selectedFlatId) {
      // console.log('getInfoFlat')
      return this.http.post(this.serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
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
    return this.http.post(this.serverPath + '/comunal/get/button', { auth: JSON.parse(userJson), flat_id: selectedFlatId, comunal: comunal_name })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Failed to retrieve comunal info:', error.message);
          return of(null);
        })
      );
  }
}
