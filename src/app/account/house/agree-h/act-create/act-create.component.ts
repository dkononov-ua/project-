import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { objects } from '../../../../data/objects-data';
import { SafeHtml } from '@angular/platform-browser';
import { animations } from '../../../../interface/animation';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { Agree } from '../../../../interface/info';

@Component({
  selector: 'app-act-create',
  templateUrl: './act-create.component.html',
  styleUrls: ['./act-create.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.top,
  ],
})

export class ActCreateComponent implements OnInit {

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }
  
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  selectedFlatAgree: any;
  isContainerVisible: boolean = false;
  indexPage: number = 1;
  message: string = '';
  statusMessage: string | undefined;
  agree: any;
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
  printableContent: SafeHtml | undefined;
  isCheckboxChecked: boolean = false;
  offs: number = 0;
  selectedAgr: any;

  goBack(): void {
    this.router.navigate(['/house/agree-menu'], { queryParams: { indexPage: 3 } });
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
    private router: Router,
  ) { }

  async ngOnInit(): Promise<any> {
    this.getSelectedFlatID();
  }

  // отримання ID обраної оселі
  getSelectedFlatID() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        await this.getInfo();
        await this.getAgree(selectedFlatId, this.offs);
        this.loadObjects();
      }
    });
  }

  // отримую угоди
  async getAgree(selectedFlatId: string | null, offs: number): Promise<void> {
    this.route.params.subscribe(async params => {
      this.selectedAgr = params['selectedFlatAgree'] || null;
    });
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/saveagreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };
    try {
      const response: any = (await this.http.post(url, data).toPromise()) as Agree[];
      this.agree = response;
      const selectedAgree = this.agree.find((agreement: { flat: { agreement_id: any; }; }) => agreement.flat.agreement_id === this.selectedAgr);
      this.selectedAgreement = selectedAgree;
      this.loading = false;
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
    this.selectedFlatId = selectedFlatId;
  }

  // шлях до іконок
  getImageSource(flat: any): string {
    if (flat.img) {
      return serverPath + '/img/filling/' + flat.img;
    } else {
      return '../../../../assets/icon-objects/default.filling.png';
    }
  }

  // отримання наповнення оселі
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

  // створити акт
  sendFormAgreement(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedAgreement) {
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
                    this.router.navigate(['/house/agree-menu'], { queryParams: { indexPage: 3 } });
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
}


