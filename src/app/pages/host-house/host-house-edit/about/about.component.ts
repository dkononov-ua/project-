import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../../interface/animation';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { SharedService } from 'src/app/services/shared.service';
import { MissingParamsService } from '../missing-params.service';
import { DataService } from 'src/app/services/data.service';

interface FlatInfo {
  students: boolean;
  woman: boolean;
  man: boolean;
  family: boolean;
  bunker: string | undefined;
  animals: string | undefined;
  option_pay: number;
  price_d: number;
  price_m: number;
  about: string | undefined;
  private: boolean;
  rent: number;
  room: number;
  price_f: number;
}
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
  ],
})

export class AboutComponent implements OnInit, OnDestroy {
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  minValue: number = 0;
  maxValue: number = 1000000;
  loading = false;

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  flatInfo: FlatInfo = {
    students: false,
    woman: false,
    man: false,
    family: false,
    bunker: undefined,
    animals: 'Неважливо',
    option_pay: 1,
    price_d: 0,
    price_m: 0,
    price_f: 0.1,
    about: undefined,
    private: false,
    rent: 0,
    room: 0,
  };

  selectedFlatId!: string | null;
  descriptionVisibility: { [key: string]: boolean } = {};
  isDescriptionVisible(key: string): boolean {
    return this.descriptionVisibility[key] || false;
  }
  toggleDescription(key: string): void {
    this.descriptionVisibility[key] = !this.isDescriptionVisible(key);
  }

  helpRent: boolean = false;
  helpRoom: boolean = false;
  helpPhoto: boolean = false;
  helpPriority: boolean = false;
  statusMessage: string | undefined;
  openHelpRent() {
    this.helpRent = !this.helpRent;
  }

  openHelpRoom() {
    this.helpRoom = !this.helpRoom;
  }

  openHelpPriority() {
    this.helpPriority = !this.helpPriority;
  }

  openHelpPhoto() {
    this.helpPhoto = !this.helpPhoto;
  }

  isMobile = false;
  subscriptions: any[] = [];
  currentLocation: string = '';
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  houseData: any;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private _dialog: LyDialog,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
    await this.getSelectedFlatId();
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
        if (this.selectedFlatId) {
          this.getInfo();
        } else {
          console.log('Оберіть оселю')
        }
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }

  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.removeItem('houseData');
          localStorage.setItem('houseData', JSON.stringify(response));
          this.sharedService.setStatusMessage('Оновлюємо інформацію...');
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  async saveInfo(rent: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      if (this.flatInfo.option_pay === 2) {
        this.flatInfo.price_m = 1;
        this.flatInfo.price_d = 1;
      }
      const data = {
        students: this.flatInfo.students || undefined,
        woman: this.flatInfo.woman || undefined,
        man: this.flatInfo.man || undefined,
        family: this.flatInfo.family || undefined,
        bunker: this.flatInfo.bunker || undefined,
        animals: this.flatInfo.animals || 'Неважливо',
        option_pay: this.flatInfo.option_pay || 0,
        price_d: this.flatInfo.price_d,
        price_m: this.flatInfo.price_m,
        about: this.flatInfo.about || undefined,
        private: this.flatInfo.private || false,
        rent: rent,
        room: this.flatInfo.room || 0,
      }
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/about', {
          auth: JSON.parse(userJson),
          flat: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        if (response && response.status === 'Параметри успішно додані' && this.flatInfo.rent === 1) {
          this.missingParamsService.checkResponse(response);
          setTimeout(() => {
            this.updateFlatInfo();
          }, 2000);
          // якщо ми хочемо активувати але в нас не заповненні обов'язкові параметри
          if (response && response.rent) {
            this.flatInfo.rent = 0;
          } else {
            // якщо ми хочемо активувати і є всі параметри
            this.sharedService.setStatusMessage('Оголошення розміщено');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оновлюємо інформацію');
              setTimeout(() => {
                this.router.navigate(['/house']);
                this.sharedService.setStatusMessage('');
              }, 1000);
            }, 1500);
          }
        } else if (response && response.status === 'Параметри успішно додані' && this.flatInfo.rent === 0) {
          this.updateFlatInfo();
          setTimeout(() => {
            this.sharedService.setStatusMessage('Параметри успішно збережені');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оновлюємо інформацію');
              setTimeout(() => {
                // this.router.navigate(['/house']);
                this.sharedService.setStatusMessage('');
                location.reload();
              }, 1000);
            }, 1500);
          }, 500);
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка збереження');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              location.reload();
            }, 1500);
          }, 500);
        }

      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    } else {
      this.loading = false;
      console.log('user not found, the form is blocked');
    }
  }

  ngAfterViewInit() {
    this.textArea.nativeElement.style.height = 'auto';
    this.textArea.nativeElement.style.height = this.textArea.nativeElement.scrollHeight + 'px';
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  clearInfo(): void {
    this.flatInfo = {
      students: false,
      woman: false,
      man: false,
      family: false,
      bunker: '',
      animals: 'Неважливо',
      option_pay: 0,
      price_d: 0,
      price_m: 0,
      price_f: 0,
      about: '',
      private: false,
      rent: 0,
      room: 0,

    };
  }

  async getInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId }).toPromise();
        if (response && response.about) {
          this.flatInfo = response.about;
        } else {
          console.log('about not found in response.');
        }
      } catch (error) {
        this.sharedService.setStatusMessage('Помилка на сервері, спробуйте ще раз');
        setTimeout(() => {
          this.sharedService.setStatusMessage('');
          location.reload();
        }, 1500);
      }
    } else {
      console.log('user not found');
    }
  };

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
