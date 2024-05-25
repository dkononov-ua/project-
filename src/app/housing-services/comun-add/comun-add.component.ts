import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangeComunService } from '../change-comun.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DeleteComunComponent } from '../delete-comun/delete-comun.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as ServerConfig from 'src/app/config/path-config';
import { ViewComunService } from 'src/app/discussi/discussio-user/discus/view-comun.service';
import { animations } from '../../interface/animation';
import { DiscussioViewService } from 'src/app/services/discussio-view.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-comun-add',
  templateUrl: './comun-add.component.html',
  styleUrls: ['./comun-add.component.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
  ],
})
export class ComunAddComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  comunalServicesPhoto = [
    { name: "Опалення", imageUrl: "../../../assets/example-comun/comun_cat3.jpg" },
    { name: "Водопостачання", imageUrl: "../../../assets/example-comun/water.jfif" },
    { name: "Вивіз сміття", imageUrl: "../../../assets/example-comun/car_scavenging3.jpg" },
    { name: "Електроенергія", imageUrl: "../../../assets/example-comun/comun_rozetka1.jpg" },
    { name: "Газопостачання", imageUrl: "../../../assets/example-comun/gas_station4.jpg" },
    { name: "Комунальна плата за утримання будинку", imageUrl: "../../../assets/example-comun/default_services.svg" },
    { name: "Охорона будинку", imageUrl: "../../../assets/example-comun/ohorona.jpg" },
    { name: "Ремонт під'їзду", imageUrl: "../../../assets/example-comun/default_services.svg" },
    { name: "Ліфт", imageUrl: "../../../assets/example-comun/default_services.svg" },
    { name: "Інтернет та телебачення", imageUrl: "../../../assets/example-comun/internet.jpg" },
  ];

  selectedImageUrl: string | null | undefined;
  defaultImageUrl: string = "../../../assets/example-comun/default_services.svg";

  popular_comunal_names = [
    "Опалення",
    "Водопостачання",
    "Вивіз сміття",
    "Електроенергія",
    "Газопостачання",
    "Утримання будинку",
    "Охорона будинку",
    "Ремонт під'їзду",
    "Ліфт",
    "Інтернет та телебачення",
    "Домофон",
  ];
  loading = false;
  comunCreate!: FormGroup;
  showInput = false;
  selectedComun: any;
  selectedFlatId!: string | null;
  selectedFlat!: string | null;
  comunal_name!: string | any;
  newComun: string = '';
  customComunal: string = '';
  discussioFlat: any;
  discussio_view: boolean = false;
  selectedView: string | null | undefined;
  selectedName: string | null | undefined;
  controlPanel: boolean = false;
  statusMessage: any;

  showPanel() {
    this.controlPanel = !this.controlPanel;
  }
  checkComun: boolean = false;


  // показ карток
  indexMenu: number = 0;
  indexPage: number = -1;
  indexCard: number = 0;

  onClickMenu(indexPage: number, indexMenu: number,) {
    this.indexPage = indexPage;
    this.indexMenu = indexMenu;
  }

  onClickHost(indexPage: number, indexMenu: number,) {
    this.indexPage = indexPage;
    this.indexMenu = indexMenu;
    this.router.navigate(['/housing-services/host-comun']);
  }

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private changeComunService: ChangeComunService,
    private selectedFlatService: SelectedFlatService,
    private route: ActivatedRoute,
    private discussioViewService: DiscussioViewService,
    private selectedViewComun: ViewComunService,
    private router: Router,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSelectParam();
    this.getDefaultData();
  }

  getDefaultData() {
    const selectedServicePhoto = this.comunalServicesPhoto.find(service => service.name === this.selectedComun);
    this.selectedImageUrl = selectedServicePhoto?.imageUrl ?? this.defaultImageUrl;
  }

  createComunName() {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const newComun = this.newComun || this.customComunal;
      if (newComun) {
        this.http.post(this.serverPath + '/comunal/add/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: newComun })
          .subscribe((response: any) => {
            if (response.status === 'Данні по комуналці успішно змінені') {
              setTimeout(() => {
                this.sharedService.setStatusMessage('Послуга створена');
                this.router.navigate(['/communal']);
                setTimeout(() => {
                  this.sharedService.setStatusMessage('');
                  location.reload();
                }, 1500);
              }, 200);
            } else {
              this.sharedService.setStatusMessage('Помилка створення або можливо така назва вже існує');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
                location.reload();
              }, 2000);
            }
          });
      } else {
        this.sharedService.setStatusMessage('Назва послуги не введена');
        setTimeout(() => {
          this.sharedService.setStatusMessage('');
        }, 1500);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Видалення послуги
  async deleteComun(comunal_name: string): Promise<void> {
    this.changeComunService.setSelectedComun(comunal_name);
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(DeleteComunComponent, {
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && this.selectedFlatId && userJson && this.selectedComun) {
        const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal_name: comunal_name };
        try {
          const response: any = await this.http.post(this.serverPath + '/comunal/delete/button', data).toPromise();
          if (response.status === true) {
            this.sharedService.setStatusMessage('Послуга видалена');
            setTimeout(() => { this.sharedService.setStatusMessage(''); location.reload() }, 2000);
          } else {
            this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
            setTimeout(() => {
              this.sharedService.setStatusMessage(''); location.reload();
            }, 2000);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  getSelectParam() {
    this.selectedViewComun.selectedView$.subscribe((selectedView: string | null) => {
      this.selectedView = selectedView;
      if (this.selectedView) {
        this.selectedFlatId = this.selectedView;
        this.getComunalName()
      } else {
        this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
          this.selectedFlatId = flatId;
          if (flatId) {
            this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
              this.selectedComun = selectedComun || this.selectedComun;
            });
            this.getComunalName()
          } else {
            this.selectedComun = null;
            this.getComunalName()
          }
        });
      }
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName;
    });

    this.discussioViewService.discussioView$.subscribe((discussio_view: boolean) => {
      this.discussio_view = discussio_view;
    });
  }

  onSelectionChangeComun(comunal_name: any): void {
    this.changeComunService.setSelectedComun(comunal_name);
  }

  async getComunalName(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (!userJson) { return; }
    const data = {
      auth: JSON.parse(userJson),
      flat_id: this.selectedFlatId,
    };
    try {
      const response: any = await this.http.post(this.serverPath + '/comunal/get/button', data).toPromise();
      if (response.comunal === false) {
        this.checkComun = false;
        return;
      }
      const firstComunal = response.comunal[0];
      if (firstComunal && firstComunal.iban !== undefined) {
        this.checkComun = true;
        this.discussio_view = false;
        this.discussioViewService.setDiscussioView(this.discussio_view);
      } else if (firstComunal && firstComunal.iban === undefined) {
        this.discussio_view = true;
        this.discussioViewService.setDiscussioView(this.discussio_view);
      }
      this.comunal_name = response.comunal.map((item: any) => {
        const matchedService = this.comunalServicesPhoto.find(service => service.name === item.comunal_name);
        if (matchedService) {
          return { ...item, imageUrl: matchedService.imageUrl };
        } else {
          return { ...item, imageUrl: '' }; // або встановіть шлях до за замовчуванням
        }
      });
      (error: any) => {
        console.error('Помилка при отриманні даних: ', error);
      }
    } catch (error) {
      console.log('Комунальні послуги відсутні')
    }
  }

  goToSetting(comunal_name: any) {
    this.changeComunService.setSelectedComun(comunal_name);
    this.sharedService.setStatusMessage('Налаштування послуги ' + comunal_name);
    setTimeout(() => {
      this.router.navigate(['/communal/company']);
      this.sharedService.setStatusMessage('');
    }, 1000);
  }

  async goToHistory(comunal_name: string): Promise<void> {
    this.sharedService.setStatusMessage('Внесення даних ' + comunal_name);
    this.changeComunService.setSelectedComun(comunal_name);
    // console.log(comunal_name)
    if (comunal_name) {
      setTimeout(() => {
        this.router.navigate(['/communal/history']);
        this.sharedService.setStatusMessage('');
      }, 1000);
    }
  }

  selectComun(comunal_name: any) {
    this.changeComunService.setSelectedComun(comunal_name);
  }

  goToStatSeason(comunal_name: any) {
    this.changeComunService.setSelectedComun(comunal_name);
    this.sharedService.setStatusMessage('Сезонна статистика ' + comunal_name);
    setTimeout(() => {
      this.router.navigate(['/communal/stat-season']);
      this.sharedService.setStatusMessage('');
    }, 1000);
  }
}

