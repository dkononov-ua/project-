import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
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

  path_logo = path_logo;
  flat_name: string = '';
  showInput = false;
  showCreate = false;
  selectedFlatId: string | null = null;
  statusMessage: string | undefined;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private location: Location,
  ) {
    this.sharedService.getStatusMessage().subscribe((message: string) => {
      this.statusMessage = message;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getSelectParam();
    const selectedFlatName = localStorage.getItem('selectedFlatName');
    if (selectedFlatName !== null) {
      this.selectedFlatName = selectedFlatName;
    } else {
    }
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        const houseData = localStorage.getItem('houseData');
        if (houseData) {
          const parsedHouseData = JSON.parse(houseData);
          this.houseData = parsedHouseData;
          if (this.houseData) {
            this.getHouseAcces();
          }
        }
      }
    });
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
            .post(serverPath + '/flatinfo/deleteflat', {
              auth: JSON.parse(userJson),
              flat_id: this.selectedFlatId,
            })
            .subscribe(
              (response: any) => {
                localStorage.removeItem('selectedComun');
                localStorage.removeItem('selectedHouse');
                localStorage.removeItem('selectedFlatId');
                localStorage.removeItem('selectedFlatName');
                localStorage.removeItem('houseData');
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
      localStorage.removeItem('selectedComun');
      localStorage.removeItem('selectedHouse');
      localStorage.removeItem('selectedFlatId');
      localStorage.removeItem('selectedFlatName');
      localStorage.removeItem('houseData');
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

