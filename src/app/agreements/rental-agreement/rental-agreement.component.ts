import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Location } from '@angular/common';
import * as ServerConfig from 'src/app/config/path-config';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionsComponent } from '../confirm-actions/confirm-actions.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-rental-agreement',
  templateUrl: './rental-agreement.component.html',
  styleUrls: ['./rental-agreement.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class RentalAgreementComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  selectedAgreement: any;
  selectedFlatId: any;
  printableContent: SafeHtml | undefined;
  loading: boolean = true;
  statusMessage: any;
  indexPage: number = 0;
  indexUser: number = 0;
  page: any;
  user: any;
  selectedAgreeID: string = '';
  url: string = '';
  data: any;
  deletingFlatId: string | null = null;
  isCheckboxChecked = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
    private sanitizer: DomSanitizer,
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {
        await this.getParams();
      }
    })
    this.loading = false;
  }

  // Отримання айді обраної оселі
  async getSelectedFlatID(selectedAgreeID: string) {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        await this.getAgree(selectedAgreeID);
      } else { }
    });
  }

  goBack(): void {
    this.location.back();
  }

  async getParams(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      this.selectedAgreeID = params['agreement_id'] || null;
      this.page = params['indexPage'] || 0;
      this.user = params['indexUser'] || 0;
      this.indexPage = Number(this.page);
      this.indexUser = Number(this.user);
      // Сторінка для перегляду надісланої угоди
      if (this.indexUser === 1 && this.selectedAgreeID) {
        await this.getAgree(this.selectedAgreeID);
      }
      else if (this.indexUser === 2 && this.selectedAgreeID) {
        await this.getSelectedFlatID(this.selectedAgreeID);
      }
    });
  }

  async getAgree(selectedAgreeID: string): Promise<any> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    if (selectedAgreeID && this.indexUser === 2) {
      this.data = {
        auth: JSON.parse(userJson!),
        flat_id: this.selectedFlatId,
        offs: 0
      }
      if (this.indexPage === 1) {
        // Отримати надіслані угоди оселі
        this.url = this.serverPath + '/agreement/get/agreements';
      } else if (this.indexPage === 2) {
        // Отримати погоджені угоди оселі
        this.url = this.serverPath + '/agreement/get/saveagreements';
      }
    } else if (selectedAgreeID && this.indexUser === 1) {
      this.data = {
        auth: JSON.parse(userJson!),
        user_id: user_id,
        offs: 0,
      }
      if (this.indexPage === 1) {
        // Отримати надіслані угоди користувача
        this.url = this.serverPath + '/agreement/get/yagreements';
      } else if (this.indexPage === 2) {
        // Отримати погоджені угоди користувача
        this.url = this.serverPath + '/agreement/get/saveyagreements';
      }
    }
    try {
      const response = (await this.http.post(this.url, this.data).toPromise()) as any[];
      if (response) {
        const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === this.selectedAgreeID);
        if (selectedAgreement) {
          this.selectedAgreement = selectedAgreement;
          // console.log(this.selectedAgreement)
        } else {
          this.sharedService.setStatusMessage('Угода не знайдена');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.router.navigate(['/house/agree-menu']);
          }, 2000);
        }
      } else {
        this.sharedService.setStatusMessage('Помилка отримання даних');
        setTimeout(() => {
          this.router.navigate(['/house/agree-menu']);
          this.sharedService.setStatusMessage('');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  confirmActions(actions: string) {
    // console.log(this.selectedAgreement)
    const dialogRef = this.dialog.open(ConfirmActionsComponent, {
      data: { actions: actions, flat_id: this.selectedAgreement.flat.flat_id, owner_firstName: this.selectedAgreement.flat.owner_firstName, owner_lastName: this.selectedAgreement.flat.owner_lastName, city: this.selectedAgreement.flat.city, street: this.selectedAgreement.flat.street, houseNumber: this.selectedAgreement.flat.houseNumber }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (actions === 'reject' && result === true) {
        await this.rejectAgreement();
      } else { }
      if (actions === 'accept' && result === true) {
        await this.acceptAgreement();
      } else { }
    });
  }

  async rejectAgreement(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = this.serverPath + '/agreement/delete/yagreement';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      flat_id: this.selectedAgreement.flat.flat_id,
      agreement_id: this.selectedAgreement.flat.agreement_id,
    };
    try {
      const response = await this.http.post(url, data).toPromise();
      if (response) {
        this.sharedService.setStatusMessage('Умови угоди відхилено');
        setTimeout(() => {
          this.router.navigate(['/user/agree/menu']);
          this.sharedService.setStatusMessage('');
        }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка видалення');
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async acceptAgreement(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        agreement_id: this.selectedAgreement.flat.agreement_id,
        flat_id: this.selectedAgreement.flat.flat_id,
        user_id: this.selectedAgreement.flat.subscriber_id,
        i_agree: true,
      };
      this.loading = true;
      try {
        const response = (await this.http.post(this.serverPath + '/agreement/accept/agreement', data).toPromise()) as any;
        if (response.status === 'Договір погоджено') {
          this.sharedService.setStatusMessage('Умови угоди ухвалені!');
          setTimeout(() => {
            this.router.navigate(['/user/agree/concluded']);
            this.sharedService.setStatusMessage('');
          }, 3000);
        } else {
          this.sharedService.setStatusMessage('Помилка ухвалення умов угоди угоди');
          setTimeout(() => { this.loading = false; this.sharedService.setStatusMessage(''); }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Помилка на сервері, спробуйте пізніше');
        setTimeout(() => { location.reload }, 2000);
      }
    }
  }

  print(): void {
    const printContainer = document.querySelector('.print-only');
    if (printContainer) {
      this.printableContent = this.sanitizer.bypassSecurityTrustHtml(printContainer.innerHTML);
      const filename = 'ugoda';
      setTimeout(() => {
        window.print();
      });
    }
  }

}


