import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { objects } from '../../../../shared/objects-data';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, path_logo } from 'src/app/shared/server-config';
import { Location } from '@angular/common';

interface Agree {
  flat: {
    agreementDate: string;
    agreement_id: string;
    apartment: string;
    city: string;
    flat_id: string;
    houseNumber: string;
    max_penalty: string;
    month: number;
    owner_email: string;
    owner_firstName: string;
    owner_id: string;
    owner_lastName: string;
    owner_surName: string;
    owner_tell: string;
    owner_img: string;
    penalty: string;
    price: string;
    rent_due_data: number;
    street: string;
    subscriber_email: string;
    subscriber_firstName: string;
    subscriber_id: string;
    subscriber_lastName: string;
    subscriber_surName: string;
    subscriber_tell: string;
    year: number;
    area: number;
  };
  img: string[];
}
@Component({
  selector: 'app-uact-view',
  templateUrl: './uact-view.component.html',
  styleUrls: ['./uact-view.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1500ms 0ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1500ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1500ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),

  ],
})

export class UactViewComponent implements OnInit {
  serverPath = serverPath;
  path_logo = path_logo;
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
  selectedAct!: any;

  goBack(): void {
    this.location.back();
  }

  changeStep(step: number): void {
    this.currentStep = step;
  }

  openContainer() {
    this.isContainerVisible = true;
  }

  closeContainer() {
    this.isContainerVisible = false;
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
    });

    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      await this.getAgreeAct();
      await this.getHouse();
      this.selectedAgreement = await this.getAgree();
      this.loadObjects();
    });
  }

  async getAgree(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/agreement/get/saveyagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as any[];
      const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === this.selectedFlatAgree);
      return selectedAgreement || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAgreeAct(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/yAct';
    const data = {
      auth: JSON.parse(userJson!),
      agreement_id: this.selectedFlatAgree,
    };
    try {
      const response = (await this.http.post(url, data).toPromise()) as any[];
      this.selectedAct = response[0];
      this.flat_objects = response[1];
    } catch (error) {
      console.log("Сформованого акту немає.");
      return null;
    }
  }

  async getHouse(): Promise<void> {
    try {
      const response: any = await this.dataService.getData().toPromise();
      this.houseData = response.houseData;
      if (this.houseData.imgs === 'Картинок нема') {
        this.houseData.imgs =  serverPath +['/img/flat/housing_default.svg'];
      }
    } catch (error) {
      console.error(error);
    }
  }

  getImageSource(flat: any): string {
    if (flat.img) {
      return serverPath + '/img/filling/' + flat.img;
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




