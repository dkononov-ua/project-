import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ReportsComponent } from '../components/reports/reports.component';
import { SelectedFlatService } from './selected-flat.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CheckBackendService } from './check-backend.service';
import { UsereSearchConfig } from '../interface/param-config';
import { UserInfo } from '../interface/info';
import * as ServerConfig from 'src/app/config/path-config';
import { StatusMessageService } from './status-message.service';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  userInfo: UserInfo = UsereSearchConfig;
  numberOfReviewsTenant: any;
  numberOfReviewsOwner: any;
  ratingOwner: number | undefined;
  ratingTenant: number | undefined;

  selectedFlatId!: string | null;

  private reportResultSubject = new Subject<any>();
  private checkOwnerPageSubject = new BehaviorSubject<string>('');
  public checkOwnerPage$ = this.checkOwnerPageSubject.asObservable();

  private checkIsMobileSubject = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.checkIsMobileSubject.asObservable();

  private statusServerSubject = new BehaviorSubject<string>('');
  public statusServer$ = this.statusServerSubject.asObservable();

  // Відслідковування зміни шляху до серверу
  private checkServerPathSubject = new BehaviorSubject<string>('');
  public serverPath$ = this.checkServerPathSubject.asObservable();

  serverPath: string = '';

  firstPath: string = ServerConfig.firstPath;
  secondPath: string = ServerConfig.secondPath;

  loading: boolean | undefined;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private location: Location,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private statusMessageService: StatusMessageService,
  ) {
    this.getServerPath();
    const storedCheckOwner = localStorage.getItem('checkOwnerPage');
    if (storedCheckOwner) { this.checkOwnerPageSubject.next(storedCheckOwner); }
    this.checkIsMobile();
  }

  getServerPath() {
    const savedServerPath = localStorage.getItem('savedServerPath');
    // console.log('Шлях:', savedServerPath)
    if (savedServerPath) {
      // якщо є збережений шлях ми беремо його для порівняння
      this.serverPath = savedServerPath;
      this.setServerPath(this.serverPath);
    } else {
      // якщо немає ми беремо перший
      this.serverPath = this.firstPath;
      this.setServerPath(this.serverPath);
    }
  }

  async setServerPath(path: string): Promise<any> {
    localStorage.removeItem('savedServerPath');
    // console.log('Передаю всім компонентам шлях', path);
    this.checkServerPathSubject.next(this.serverPath);
    localStorage.setItem('savedServerPath', path);
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      // console.log(this.selectedFlatId)
    });
  }

  setStatusServer(status: string) {
    localStorage.removeItem('savedStatusServer');
    // console.log(status)
    this.statusServerSubject.next(status);
    localStorage.setItem('savedStatusServer', status);
  }

  checkIsMobile() {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      // console.log('Перевіряю пристрій на якому переглядають')
      this.checkIsMobileSubject.next(result.matches);
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
    const url = this.serverPath + '/reports/flat';
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
    const url = this.serverPath + '/reports/user';
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

  setStatusMessage(message: string): void {
    this.statusMessageService.setStatusMessage(message);
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
    this.statusMessageService.setStatusMessage('Для цього потрібно бути авторизованим');
    setTimeout(() => {
      this.router.navigate(['/house/house-info']);
      this.statusMessageService.setStatusMessage('');
    }, 3000);
  }

  getAuthorizationHouse() {
    this.statusMessageService.setStatusMessage('Для цього потрібно створити або обрати оселю');
    setTimeout(() => {
      this.router.navigate(['/house/house-control/add-house']);
      this.statusMessageService.setStatusMessage('');
    }, 3000);
  }

  logout() {
    this.statusMessageService.setStatusMessage('Потрібно авторизуватись');
    this.clearCache();
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
      this.statusMessageService.setStatusMessage('');
    }, 1500);
  }

  logoutHouse() {
    this.statusMessageService.setStatusMessage('Потрібно обрати оселю');
    this.clearCacheHouse();
    setTimeout(() => {
      this.router.navigate(['/house/house-control/selection-house']);
      this.statusMessageService.setStatusMessage('');
    }, 1500);
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

  //Запитую рейтинг власника
  async getRatingOwner(userID: string): Promise<{ ratingOwner: number; numberOfReviewsOwner: number; }> {
    const userJson = localStorage.getItem('user');
    const data = {
      auth: JSON.parse(userJson!),
      user_id: userID,
    };
    if (userJson && data) {
      try {
        const response = await this.http.post(this.serverPath + '/rating/get/ownerMarks', data).toPromise() as any;
        if (response && Array.isArray(response.status)) {
          let ratingOwner = 0;
          let numberOfReviewsOwner = response.status.length;
          response.status.forEach((item: any) => {
            if (item.info && item.info.mark) {
              ratingOwner += item.info.mark;
            }
          });
          // Після того як всі оцінки додані, ділимо загальну суму на кількість оцінок
          if (numberOfReviewsOwner > 0) {
            ratingOwner = ratingOwner / numberOfReviewsOwner;
          } else {
            ratingOwner = 0;
          }
          return { ratingOwner, numberOfReviewsOwner };
        } else {
          // Якщо немає оцінок
          return { ratingOwner: 0, numberOfReviewsOwner: 0 };
        }
      } catch (error) {
        console.error(error);
        return { ratingOwner: 0, numberOfReviewsOwner: 0 };
      }
    }
    // Якщо немає даних користувача
    return { ratingOwner: 0, numberOfReviewsOwner: 0 };
  }

  //Запитую рейтинг орендаря
  async getRatingTenant(userID: string): Promise<{ ratingTenant: number; numberOfReviewsTenant: number; }> {
    const userJson = localStorage.getItem('user');
    const data = {
      auth: JSON.parse(userJson!),
      user_id: userID,
    };
    // console.log(this.serverPath)
    try {
      const response = await this.http.post(this.serverPath + '/rating/get/userMarks', data).toPromise() as any;
      // console.log(response)
      if (response && Array.isArray(response.status)) {
        let ratingTenant = 0;
        let numberOfReviewsTenant = response.status.length;
        response.status.forEach((item: any) => {
          if (item.info && item.info.mark) {
            ratingTenant += item.info.mark;
          }
        });
        // Після того як всі оцінки додані, ділимо загальну суму на кількість оцінок
        if (numberOfReviewsTenant > 0) {
          ratingTenant = ratingTenant / numberOfReviewsTenant;
        } else {
          ratingTenant = 0;
        }
        return { ratingTenant, numberOfReviewsTenant };
      } else {
        // Якщо немає оцінок
        return { ratingTenant: 0, numberOfReviewsTenant: 0 };
      }
    } catch (error) {
      // Обробка помилок
      console.error(error);
      return { ratingTenant: 0, numberOfReviewsTenant: 0 };
    }
  }



}
