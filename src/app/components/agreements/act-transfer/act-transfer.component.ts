import { Component, HostListener, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { objects } from '../../../data/objects-data';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Location } from '@angular/common';
import * as ServerConfig from 'src/app/config/path-config';
import { Agree } from '../../../interface/info';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-act-transfer',
  templateUrl: './act-transfer.component.html',
  styleUrls: ['./act-transfer.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class ActTransferComponent implements OnInit {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  selectedFlatAgree: any;
  isContainerVisible: boolean = false;
  currentStep: number = 1;
  message: string = '';
  statusMessage: string | undefined;
  agree: Agree[] = [];
  loading: boolean = false;
  selectedFlatId: any;
  selectedAgreement: any;
  selectCondition: { [key: number]: string } = {
    0: 'Новий',
    1: 'Задовільний',
    2: 'Пошкоджений',
    3: 'Несправний',
  }

  objects = objects;
  flat_objects!: any;
  filteredObjects: any[] = [];
  selectedType!: string;
  selectedObject: any;
  fillingImg: any;
  selectedIconUrl: string = '';
  defaultIcon = '../../../assets/icon-objects/add_circle.png';
  printOpen: boolean = false;
  houseData: any;
  printableContent: SafeHtml | undefined;
  isCheckboxChecked: boolean = false;
  selectedAgree: any;
  selectedAct: any;

  indexPage: number = 0;
  indexUser: number = 0;
  page: any;
  user: any;
  selectedAgreeID: string = '';
  url: string = '';
  data: any;
  deletingFlatId: string | null = null;

  changeStep(step: number): void {
    this.currentStep = step;
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
    private sanitizer: DomSanitizer,
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService,
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
        await this.getHouse();
        await this.getAgree(this.selectedAgreeID);
        this.selectedAct = await this.getAgreeAct(this.selectedAgreeID);
        this.loadObjects();
      }
      else if (this.indexUser === 2 && this.selectedAgreeID) {
        await this.getSelectedFlatID(this.selectedAgreeID);
      }
    });
  }

  // Отримання айді обраної оселі
  async getSelectedFlatID(selectedAgreeID: string) {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        await this.getHouse();
        await this.getAgree(selectedAgreeID);
        this.selectedAct = await this.getAgreeAct(selectedAgreeID);
        this.loadObjects();
      } else { }
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
        // Отримати погоджені угоди користувача
        this.url = this.serverPath + '/agreement/get/saveyagreements';
      }
    }
    try {
      const response = (await this.http.post(this.url, this.data).toPromise()) as any[];
      if (response) {
        const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === this.selectedAgreeID);
        if (selectedAgreement) {
          this.selectedAgreement = selectedAgreement
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
          this.sharedService.setStatusMessage('');
          this.router.navigate(['/house/agree-menu']);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAgreeAct(selectedAgreeID: string): Promise<any> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    if (selectedAgreeID && this.indexUser === 2) {
      this.data = {
        auth: JSON.parse(userJson!),
        flat_id: this.selectedFlatId,
        agreement_id: selectedAgreeID,
        offs: 0
      }
      if (this.indexPage === 1) {
        // Отримати акти оселі
        this.url = this.serverPath + '/agreement/get/act';
      }
    } else if (selectedAgreeID && this.indexUser === 1) {
      this.data = {
        auth: JSON.parse(userJson!),
        agreement_id: selectedAgreeID,
      }
      if (this.indexPage === 1) {
        // Отримати акти користувача
        this.url = this.serverPath + '/agreement/get/yAct';
      }
    }
    try {
      const response = (await this.http.post(this.url, this.data).toPromise()) as any[];
      const selectedAct = response[0];
      this.flat_objects = response[1];
      return selectedAct || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getHouse(): Promise<void> {
    try {
      const response: any = await this.dataService.getInfoFlat().toPromise();
      this.houseData = response;
      if (this.houseData.imgs === 'Картинок нема') {
        this.houseData.imgs = [this.serverPath + '/img/flat/housing_default.svg'];
      }
    } catch (error) {
      console.error(error);
    }
  }

  getImageSource(flat: any): string {
    if (flat.img) {
      return this.serverPath + '/img/filling/' + flat.img;
    } else {
      return '../../../../assets/icon-objects/default.filling.png';
    }
  }

  getIconUrl(type: string, name: string): string {
    const selectedTypeObj = this.objects.find(obj => obj.type === type);
    if (selectedTypeObj) {
      const selectedObj = selectedTypeObj.object.find(obj => obj.name === name);
      return selectedObj ? selectedObj.iconUrl : this.defaultIcon;
    } else {
      return this.defaultIcon;
    }
  }

  loadObjects() {
    if (this.selectedType) {
      const selectedTypeObj = this.objects.find(obj => obj.type === this.selectedType);
      this.filteredObjects = selectedTypeObj ? selectedTypeObj.object : [];
      this.selectedObject = null;
    } else {
      this.filteredObjects = [];
      this.selectedObject = null;
    }
  }

  print(): void {
    const printContainer = document.querySelector('.print-only');
    if (printContainer) {
      this.printableContent = this.sanitizer.bypassSecurityTrustHtml(printContainer.innerHTML);
      setTimeout(() => {
        window.print();
      });
    }
  }
}



