import { Component, HostListener, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { objects } from '../../../../shared/objects-data';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/shared/server-config';
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
  selector: 'app-act-reception-transmission',
  templateUrl: './act-reception-transmission.component.html',
  styleUrls: ['./act-reception-transmission.component.scss'],
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

export class ActReceptionTransmissionComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  selectedFlatAgree: any;
  isContainerVisible: boolean = false;
  currentStep: number = 1;
  message: string = '';
  statusMessage: string | undefined;
  agree: Agree[] = [];
  loading: boolean = true;
  selectedFlatId: any;
  selectedAgreement: any;

  gas: number = 0;
  electro: number = 0;
  hot_water: number = 0;
  cold_water: number = 0;

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
    private router: Router,
  ) { }

  async ngOnInit(): Promise<any> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      const offs = 0;
      await this.getInfo();
      await this.getHouse();
      await this.getAgree(selectedFlatId, offs);
      this.loadObjects();
    });

    this.route.params.subscribe(params => {
      this.agree = params['selectedFlatAgree'] || null;
    });
  }

  async getAgree(selectedFlatId: string | null, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/saveagreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as Agree[];
      this.agree = response;
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
    this.selectedFlatId = selectedFlatId;
  }

  async getHouse(): Promise<void> {
    try {
      const response: any = await this.dataService.getData().toPromise();
      this.houseData = response.houseData;
      if (this.houseData.imgs === 'Картинок нема') {
        this.houseData.imgs = [serverPath + '/img/flat/housing_default.svg'];
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

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');

    if (this.selectedFlatId && userJson) {
      const response = await this.http.post(serverPath + '/flatinfo/get/filling', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
      }).toPromise() as any;
      if (response) {
        this.flat_objects = response.status;
      }
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

  sendFormAgreement(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedAgreement) {
      if (!this.selectedAgreement) {
        this.showMessage('Будь ласка, оберіть угоду');
        return;
      }
      if (this.selectedAgreement && this.selectedFlatId) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          agreement_id: this.selectedAgreement.flat.agreement_id,

          counter: {
            gas: this.gas || '',
            electro: this.electro || '',
            hot_water: this.hot_water || '',
            cold_water: this.cold_water || '',
          },

          filling: this.flat_objects,
        };

        this.http.post(serverPath + '/agreement/add/act', data)
          .subscribe(
            (response: any) => {
              this.loading = true;
              if (response.status === 'Данні введено не правильно') {
                console.error(response.status);
                setTimeout(() => {
                  this.statusMessage = 'Помилка формування акту.';
                  setTimeout(() => {
                    location.reload();
                  }, 2000);
                }, 2000);
              } else {
                setTimeout(() => {
                  this.statusMessage = 'Акт сформовано успішно!';
                  setTimeout(() => {
                    this.router.navigate(['/house/agree-concluded']);
                  }, 2000);
                }, 1000);
              }
            },
            (error: any) => {
              console.error(error);
              setTimeout(() => {
                this.statusMessage = 'Помилка формування акту.';
                setTimeout(() => {
                  location.reload();
                }, 2000);
              }, 2000);
            }
          );
        this.loading = false;
      } else {
        console.log('User, flat, or subscriber not found');
        this.loading = false;
      }
    }
  }

  showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }

  clearMessage(): void {
    this.message = '';
  }
}


