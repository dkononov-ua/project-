import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { ActivatedRoute } from '@angular/router';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';

@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.scss'],
  animations: [
    animations.right1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})

export class ResidentComponent implements OnInit {

  page: any;
  card: any;

  selectMyPage: boolean = false;

  isCopiedMessage!: string;
  indexPage: number = 0;
  indexCard: number = 0;
  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  selectedFlatId: string | any;
  loading = false;
  ownerInfo: any
  statusMessage: string | undefined;
  iResident: string = '';
  iPickUser: boolean = false;

  goBack(): void {
    this.location.back();
  }
  isMobile = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private choseSubscribersService: ChoseSubscribersService,

  ) { }

  async ngOnInit(): Promise<void> {
    // перевірка який пристрій
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.getSelectedFlat();
  }

  // Отримую обрану оселю і виконую запит по її власнику та мешкнцям
  async getSelectedFlat() {
    // console.log('getSelectedFlat')
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        const offs = 0;
        this.getOwner(this.selectedFlatId, offs);
        this.selectResidents();
      } else {
        console.log('Оберіть оселю')
      }
    });
  }

  // Дії якщо я обрав мешканця
  async selectResidents(): Promise<any> {
    this.choseSubscribersService.selectedSubscriber$.subscribe(async subscriberId => {
      const userData = localStorage.getItem('userData');
      if (subscriberId && userData) {
        this.iPickUser = true;
      } else {
        this.iPickUser = false;
      }
    });
  }

  // Отримую інформацію про власника
  async getOwner(selectedFlatId: any, offs: number): Promise<any> {
    const userData = localStorage.getItem('userData');
    const userJson = localStorage.getItem('user');
    if (userJson && userData) {
      const userObject = JSON.parse(userData);
      const user_id = userObject.inf.user_id;
      const data = { auth: JSON.parse(userJson!), user_id: user_id, flat_id: selectedFlatId, offs: offs, };
      try {
        const response = await this.http.post(serverPath + '/citizen/get/ycitizen', data).toPromise() as any[];
        const ownerInfo = response.find(item => item.flat.flat_id.toString() === selectedFlatId)?.owner;
        if (ownerInfo) {
          if (user_id === ownerInfo.user_id) {
            this.iResident = 'false';
            this.sharedService.setCheckOwnerPage(this.iResident);
          } else {
            this.iResident = 'true';
            this.ownerInfo = ownerInfo;
            this.sharedService.setCheckOwnerPage(this.iResident);
            localStorage.setItem('ownerInfo', JSON.stringify(ownerInfo));
          }
        } else {
          this.iResident = 'false';
        }
        // console.log(this.iResident)
      } catch (error) {
        console.error(error);
      }
    }
  }
}

