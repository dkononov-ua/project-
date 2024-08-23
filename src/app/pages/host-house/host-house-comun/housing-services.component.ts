import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { ChangeComunService } from '../../../services/comun/change-comun.service';
import { DiscussioViewService } from '../../../services/discussio-view.service';
import { DeleteComunComponent } from './delete-comun/delete-comun.component';
import { SharedService } from '../../../services/shared.service';
import { ViewComunService } from '../../host-user/host-user-discus/discus/view-comun.service';

@Component({
  selector: 'app-housing-services',
  templateUrl: './housing-services.component.html',
  styleUrls: ['./../../pages.scss'],
  animations: [
    animations.right1,
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
export class HousingServicesComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

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
  selectedName: string = '';
  controlPanel: boolean = false;
  statusMessage: any;

  // показ карток
  indexPage: number = 0;
  startX = 0;
  page: any;

  isMobile = false;

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
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });

  }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSelectParam();
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
    });
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }

  // оброблюю свайп
  onSwiped(direction: string) {
    // console.log(direction);
    if (!this.selectedName) {
      if (direction === 'right' && this.indexPage !== 0) {
        this.indexPage--;
      } else if (direction === 'right' && this.indexPage === 0 && this.selectedFlatId) {
        this.router.navigate(['/house/house-info']);
      } else if (direction !== 'right' && this.indexPage !== 4) {
        this.indexPage++;
      }
    } else {
      if (direction === 'right') {
        this.backToDiscus();
      }
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.selectedViewComun.selectedView$.subscribe((selectedView: string | null) => {
      this.selectedView = selectedView;
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName || '';
    });

    this.discussioViewService.discussioView$.subscribe((discussio_view: boolean) => {
      this.discussio_view = discussio_view;
    });

    this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
      this.selectedComun = selectedComun || this.selectedComun;
    });
  }

  backToDiscus() {
    localStorage.removeItem('selectedView');
    localStorage.removeItem('selectedName');
    this.selectedViewComun.clearSelectedView();
    this.selectedViewComun.clearSelectedName();
    this.sharedService.setStatusMessage('Повертаємось до дискусії');
    setTimeout(() => {
      this.sharedService.setStatusMessage('');
      this.router.navigate(['/subscribers-discuss']);
    }, 2000);
  }

  createComunName() {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const newComun = this.newComun || this.customComunal;
      if (newComun) {
        this.http.post(this.serverPath + '/comunal/add/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: newComun })
          .subscribe((response: any) => {
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('Назва послуги не введена');
      }
    } else {
      console.log('user not found');
    }
    location.reload();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeleteComunComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const userJson = localStorage.getItem('user');
        if (this.selectedFlatId && userJson && this.selectedComun) {
          this.http.post(this.serverPath + '/comunal/delete/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal_name: this.selectedComun })
            .subscribe((response: any) => {
              console.log(response)
            }, (error: any) => {
              console.error(error);
            });
          setTimeout(() => {
            location.reload();
          }, 200);
        } else {
          console.log('house not found');
        }
      }
    });
  }
}
