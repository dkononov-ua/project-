import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteHouseComponent } from 'src/app/components/house/delete-house/delete-house.component';
import { Location } from '@angular/common';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-house-control',
  templateUrl: './house-control.component.html',
  styleUrls: ['./house-control.component.scss'],
  animations: [
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

export class HouseControlComponent implements OnInit {

  // імпорт шляхів
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

  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;
  houseData: any;
  goBack(): void {
    this.location.back();
  }
  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  flat_name: string = '';
  showInput = false;
  showCreate = false;
  selectedFlatId: string | null = null;
  statusMessage: string | undefined;

  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private location: Location,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.getSelectedFlatId();
    this.checkUserAuthorization();
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
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.checkHouseAuthorization();
    } else {
      this.authorization = false;
    }
  }

  // Перевірка на авторизацію оселі
  async checkHouseAuthorization() {
    const houseData = localStorage.getItem('houseData');
    if (this.selectedFlatId && houseData) {
      this.authorizationHouse = true;
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
      this.getHouseAcces();
      this.getSelectedFlatName();
    } else {
      this.authorizationHouse = false;
    }
  }

  getSelectedFlatName() {
    const selectedFlatName = localStorage.getItem('selectedFlatName');
    if (selectedFlatName) {
      this.selectedFlatName = selectedFlatName;
    }
  }

  async openDialog(): Promise<void> {
    const selectedFlatName = localStorage.getItem('selectedFlatName');
    if (selectedFlatName !== null) {
      this.selectedFlatName = selectedFlatName
    } else { }
    const dialogRef = this.dialog.open(DeleteHouseComponent, {
      data: { flat_name: selectedFlatName, }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        const userJson = localStorage.getItem('user');
        if (this.selectedFlatId && userJson) {
          this.http
            .post(this.serverPath + '/flatinfo/deleteflat', {
              auth: JSON.parse(userJson),
              flat_id: this.selectedFlatId,
            })
            .subscribe(
              (response: any) => {
                this.sharedService.clearCacheHouse();
                this.statusMessage = 'Оселя видалена';
                this.sharedService.setStatusMessage('Оселя видалена');
                setTimeout(() => {
                  this.statusMessage = '';
                  this.reloadPageWithLoader()
                }, 1500);
              },
              (error: any) => {
                console.error(error);
              }
            );
        } else {
          console.log('house not found');
          this.reloadPageWithLoader()
        }
      }
    });
  }

  async exitHouse(): Promise<void> {
    this.loading = true;
    this.sharedService.setStatusMessage('Виходимо з оселі');
    setTimeout(() => {
      this.sharedService.setStatusMessage('Очищуємо дані');
      this.sharedService.clearCacheHouse();
      setTimeout(() => {
        this.sharedService.setStatusMessage('Очищено');
        setTimeout(() => {
          location.reload();
        }, 500);
      }, 1000);
    }, 1000);
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
    }
  }

}

