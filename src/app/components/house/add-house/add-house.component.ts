import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../interface/animation';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

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

export class AddHouseComponent implements OnInit {

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
  selectedFlatId!: string | null;
  statusMessage: string | undefined;


  isMobile = false;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    // перевірка який пристрій
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.getSelectParam();
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        const selectedFlatName = localStorage.getItem('selectedFlatName');
        if (selectedFlatName) {
          this.selectedFlatName = selectedFlatName;
        }
      }
    });
  }

  async houseCreate(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
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
          this.statusMessage = 'Оселя ' + this.flat_name + ' успішно створена';
          this.sharedService.setStatusMessage('Оселя ' + this.flat_name + ' успішно створена');
          setTimeout(() => {
            this.statusMessage = '';
            this.loadNewFlats(this.flat_name);
          }, 2000);
        } else {
          this.statusMessage = 'Помилка створення';
          setTimeout(() => {
            this.statusMessage = '';
            this.reloadPageWithLoader()
          }, 1500);
        }
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    }
  }

  async loadNewFlats(flat_name: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/localflatid', JSON.parse(userJson)).toPromise();
        const flatInfo = response.ids.find((flat: any) => flat.flat_name === flat_name);
        if (flatInfo) {
          const flatIdFromResponse = flatInfo.flat_id;
          if (flatIdFromResponse) {
            this.selectedFlatService.setSelectedFlatId(flatIdFromResponse);
            this.selectedFlatService.setSelectedFlatName(flat_name);
            this.sharedService.setStatusMessage('Переходимо до налаштувань ' + flat_name);
            this.statusMessage = 'Переходимо до налаштувань ' + flat_name;
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              this.statusMessage = '';
              if (this.isMobile) {
                this.router.navigate(['/edit-house/instruction']);
              } else {
                this.router.navigate(['/edit-house/address']);
              }
            }, 2500);
          }
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Щось пішло не так, повторіть спробу';
        setTimeout(() => { this.statusMessage = ''; }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  openBtn() {
    this.showInput = !this.showInput;
  }

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

}
