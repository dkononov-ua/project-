import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../interface/animation';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-add-house',
  templateUrl: './add-house.component.html',
  styleUrls: ['./add-house.component.scss'],
  animations: [
    animations.top2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
  ],
})

export class AddHouseComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  @ViewChild('flatIdInput') flatIdInput: any;
  loading = false;
  setSelectedFlatId: any;
  setSelectedFlatName: any;
  selectedFlatName: any;
  flat_name: string = '';
  showInput = false;
  showCreate = false;
  selectedFlatId: any | null;
  statusMessage: string | undefined;

  subscriptions: any[] = [];
  isMobile: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private loaderService: LoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.getSelectedFlat();
  }

  // підписка на перевірку девайсу
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

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        this.selectedFlatId = Number(flatId);
        if (this.selectedFlatId) {
          this.authorizationHouse = true;
          const selectedFlatName = localStorage.getItem('selectedFlatName');
          if (selectedFlatName) {
            this.selectedFlatName = selectedFlatName;
          }
        } else {
          this.authorizationHouse = false;
        }
      })
    );
  }

  async houseCreate(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loaderService.setLoading(true);
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/flat_id', {
          auth: JSON.parse(userJson),
          new: { flat_id: this.flat_name },
        }).toPromise();
        if (response.status == 'Нова оселя успішно створена') {
          localStorage.removeItem('selectedComun');
          localStorage.removeItem('selectedHouse');
          localStorage.removeItem('selectedFlatId');
          localStorage.removeItem('selectedFlatName');
          localStorage.removeItem('houseData');
          this.sharedService.setStatusMessage('Оселя ' + this.flat_name + ' успішно створена');
          setTimeout(() => {
            this.loadNewFlats(this.flat_name);
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка створення');
          setTimeout(() => {
            this.reloadPageWithLoader()
          }, 1500);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Помилка на сервері');
        setTimeout(() => {
          this.reloadPageWithLoader()
        }, 1500);
      }
    }
  }

  async loadNewFlats(flat_name: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loaderService.setLoading(true);
        const response: any = await this.http.post(this.serverPath + '/flatinfo/localflatid', JSON.parse(userJson)).toPromise();
        const flatInfo = response.ids.find((flat: any) => flat.flat_name === flat_name);
        if (flatInfo) {
          const flatIdFromResponse = flatInfo.flat_id;
          if (flatIdFromResponse) {
            this.selectedFlatService.setSelectedFlatId(flatIdFromResponse);
            this.selectedFlatService.setSelectedFlatName(flat_name);
            this.sharedService.setStatusMessage('Переходимо до налаштувань ' + flat_name);
            setTimeout(() => {
              if (this.isMobile) {
                this.router.navigate(['/edit-house/instruction']);
              } else {
                this.router.navigate(['/edit-house/address']);
              }
              this.sharedService.setStatusMessage('');
              this.loaderService.setLoading(false);
            }, 2500);
          }
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.reloadPageWithLoader }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  openBtn() {
    this.showInput = !this.showInput;
  }

  reloadPageWithLoader() {
    this.loaderService.setLoading(true);
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
