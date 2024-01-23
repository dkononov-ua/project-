import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { ChangeComunService } from 'src/app/housing-services/change-comun.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';
import { animations } from '../../interface/animation';

@Component({
  selector: 'app-selection-housing',
  templateUrl: './selection-housing.component.html',
  styleUrls: ['./selection-housing.component.scss'],
  animations: [
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.right2,
    animations.right4,
    animations.swichCard,
  ],
})

export class SelectionHousingComponent implements OnInit {
  allFlats: any;
  allFlatsTenant: any;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  loading = false;
  selectedFlatId: any | null;
  selectedFlatName: any;
  selectedHouse: any;
  flatName: any | null;
  statusMessage: string | undefined;
  indexPage: number = 1;
  chooseFlatID: any;
  houseData: any;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private dataService: DataService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getFlatInfo();
    this.loadDataFlat();
    if (this.allFlats && this.allFlatsTenant && this.allFlats.length > 0 || this.allFlatsTenant > 0) {
      this.indexPage = 1;
    } else {
      this.indexPage = 0;
    }
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.chooseFlatID = parsedHouseData.flat.flat_id;
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  async getFlatInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const allFlats: any = await this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson)).toPromise() as any[];
        // console.log(allFlats)
        if (Array.isArray(allFlats.ids) && allFlats.ids) {
          let allFlatsInfo = await Promise.all(allFlats.ids.map(async (value: any) => {
            let infFlat: any = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
            return { flat_id: value.flat_id, flat_name: value.flat_name, flat_img: infFlat.imgs[0].img }
          }))
          this.allFlats = allFlatsInfo;
          // localStorage.setItem('allFlats', JSON.stringify(this.allFlats));
        } else {
          this.allFlats = [];
        }
        if (Array.isArray(allFlats.citizen_ids) && allFlats.citizen_ids) {
          let allFlatsTenant = await Promise.all(allFlats.citizen_ids.map(async (value: any) => {
            let infFlat: any = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
            return {
              flat_id: value.flat_id,
              flat_name: value.flat_name,
              flat_img: infFlat.imgs[0].img,
              acces_added: value.acces_added,
              acces_admin: value.acces_admin,
              acces_agent: value.acces_agent,
              acces_agreement: value.acces_agreement,
              acces_citizen: value.acces_citizen,
              acces_comunal: value.acces_comunal,
              acces_comunal_indexes: value.acces_comunal_indexes,
              acces_discuss: value.acces_discuss,
              acces_filling: value.acces_filling,
              acces_flat_chats: value.acces_flat_chats,
              acces_flat_features: value.acces_flat_features,
              acces_services: value.acces_services,
              acces_subs: value.acces_subs,
            }
          }))
          this.allFlatsTenant = allFlatsTenant;
          this.chooseFlatID = this.chooseFlatID;
          // console.log(this.allFlatsTenant)
          // localStorage.setItem('allFlatsTenant', JSON.stringify(this.allFlatsTenant));
        } else {
          this.allFlatsTenant = [];
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // обираємо іншу оселю
  selectFlat(flat: any): void {
    const userJson = localStorage.getItem('user');
    if (userJson && flat) {
      localStorage.removeItem('selectedComun');
      localStorage.removeItem('selectedHouse');
      localStorage.removeItem('selectedFlatId');
      localStorage.removeItem('selectedFlatName');
      localStorage.removeItem('houseData');
      this.statusMessage = 'Обираємо оселю ' + flat.flat_name;
      setTimeout(() => {
        this.loading = true;
        this.statusMessage = 'Оновлюємо дані дані по ' + flat.flat_name;
        this.selectedFlatService.setSelectedFlatId(flat.flat_id);
        this.selectedFlatService.setSelectedFlatName(flat.flat_name);
        this.selectedFlatService.setSelectedHouse(flat.flat_id, flat.flat_name);
        this.dataService.getInfoFlat().subscribe((response: any) => {
          if (response) {
            setTimeout(() => {
              this.statusMessage = 'Оновлено';
              localStorage.setItem('houseData', JSON.stringify(response));
              this.selectedFlatName = flat.flat_name;
              this.selectedFlatId = flat.flat_id;
              setTimeout(() => {
                location.reload();
              }, 1500);
            }, 1500);
          } else {
            console.log('Немає інформації про оселю')
            location.reload();
          }
        })
      }, 1500);
    } else {
      console.log('Авторизуйтесь')
    }

    this.chooseFlatID = flat.flat_id;
  }


}
