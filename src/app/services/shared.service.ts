import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ReportsComponent } from '../components/reports/reports.component';
import { serverPath } from 'src/app/config/server-config';
import { SelectedFlatService } from './selected-flat.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  selectedFlatId!: string | null;
  private statusMessageSubject = new BehaviorSubject<string>('');
  private reportResultSubject = new Subject<any>();
  private checkOwnerPageSubject = new BehaviorSubject<string>('');
  public checkOwnerPage$ = this.checkOwnerPageSubject.asObservable();

  private checkIsMobileSubject = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.checkIsMobileSubject.asObservable();
  loading: boolean | undefined;


  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private location: Location,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {
    const storedCheckOwner = localStorage.getItem('checkOwnerPage');
    if (storedCheckOwner) {
      this.checkOwnerPageSubject.next(storedCheckOwner);
    }
    this.checkIsMobile();
  }

  checkIsMobile() {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.checkIsMobileSubject.next(result.matches);
    });
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      // console.log(this.selectedFlatId)
    });
  }

  getReportResultSubject() {
    return this.reportResultSubject.asObservable();
  }

  setCheckOwnerPage(ownerPage: string): void {
    localStorage.setItem('checkOwnerPage', ownerPage);
    if (this.checkOwnerPageSubject.value !== ownerPage) {
      this.checkOwnerPageSubject.next(ownerPage);
    }
  }

  // скарга на оселю
  async reportHouse(flat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/reports/flat';
    const dialogRef = this.dialog.open(ReportsComponent, {
      data: {
        flatName: flat.flat_name ? flat.flat_name : flat.flat.flat_name,
        object: 'house',
      }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result !== 0 && userJson && flat) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: flat.flat_id ? flat.flat_id : flat.flat.flat_id,
          reason: result.selectedReport,
          about: result.aboutReport,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.reportResultSubject.next(response);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  // скарга на користувача
  async reportUser(user: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/reports/user';
    const dialogRef = this.dialog.open(ReportsComponent, {
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        object: 'user',
      }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result !== 0 && userJson && user) {
        const userInfo = JSON.parse(userJson);
        const data = {
          auth: JSON.parse(userJson),
          reason: result.selectedReport,
          about: result.aboutReport,
          user_id: user.user_id,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.reportResultSubject.next(response);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  getStatusMessage(): Observable<string> {
    return this.statusMessageSubject.asObservable();
  }

  setStatusMessage(message: string): void {
    this.statusMessageSubject.next(message);
  }

  reloadPage() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  goBack(): void {
    this.location.back();
  }

  getAuthorization() {
    this.setStatusMessage('Для цього потрібно бути авторизованим');
    setTimeout(() => {
      this.router.navigate(['/house/house-info']);
      this.setStatusMessage('');
    }, 3000);
  }

  getAuthorizationHouse() {
    this.setStatusMessage('Для цього потрібно створити або обрати оселю');
    setTimeout(() => {
      this.router.navigate(['/house/house-control/add-house']);
      this.setStatusMessage('');
    }, 3000);
  }

  //повна очистка кешу від попередніх даних
  clearCache() {
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    // console.log('кеш очищено повністю')
  }

  //очистка кешу від попередніх даних оселі
  clearCacheHouse() {
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
    // console.log('кеш оселі очищено')
  }


}
