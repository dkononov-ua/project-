import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ReportsComponent } from '../components/reports/reports.component';
import { serverPath } from 'src/app/config/server-config';
import { SelectedFlatService } from './selected-flat.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  selectedFlatId!: string | null;
  private reportResultSubject = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService
  ) { }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      console.log(this.selectedFlatId)
    });
  }

  getReportResultSubject() {
    return this.reportResultSubject.asObservable();
  }

  // скарга на оселю
  async reportHouse(flat: any): Promise<void> {
    console.log(flat)
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
        console.log(data)
        try {
          const response = await this.http.post(url, data).toPromise();
          console.log(response);
          this.reportResultSubject.next(response); // Відправляємо результат через Subject
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  // скарга на користувача
  async reportUser(user: any): Promise<void> {
    console.log(user)
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
        console.log(data)
        try {
          const response = await this.http.post(url, data).toPromise();
          console.log(response);
          this.reportResultSubject.next(response); // Відправляємо результат через Subject
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
}
