import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangeComunService } from '../change-comun.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DeleteComunComponent } from '../delete-comun/delete-comun.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussioViewService } from 'src/app/discussi/discussio-user/discus/discussio-view.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { ViewComunService } from 'src/app/discussi/discussio-user/discus/view-comun.service';

@Component({
  selector: 'app-comun-add',
  templateUrl: './comun-add.component.html',
  styleUrls: ['./comun-add.component.scss'],
})
export class ComunAddComponent implements OnInit {

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
  path_logo = path_logo;
  serverPath = serverPath;
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
  ) { }

  ngOnInit(): void {
    this.getSelectParam();
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.selectedViewComun.selectedView$.subscribe((selectedView: string | null) => {
      this.selectedView = selectedView;
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName;
    });

    this.discussioViewService.discussioView$.subscribe((discussio_view: boolean) => {
      this.discussio_view = discussio_view;
    });

    this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
      this.selectedComun = selectedComun || this.selectedComun;
    });
  }

  createComunName() {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const newComun = this.newComun || this.customComunal;
      if (newComun) {
        this.http.post(serverPath + '/comunal/add/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: newComun })
          .subscribe((response: any) => {
            if (response.status === 'Данні по комуналці успішно змінені') {
              setTimeout(() => {
                this.statusMessage = 'Послуга створена';
                setTimeout(() => {
                  this.statusMessage = '';
                  location.reload();
                }, 1500);
              }, 200);
            } else {
              this.statusMessage = 'Помилка створення або можливо така назва вже існує';
              setTimeout(() => {
                this.statusMessage = '';
                location.reload();
              }, 2000);
            }
          });
      } else {
        this.statusMessage = 'Назва послуги не введена';
        setTimeout(() => {
          this.statusMessage = '';
        }, 1500);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Видалення послуги
  async openDialog(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(DeleteComunComponent, {
      // data: { user_id: subscriber.user_id, firstName: subscriber.firstName, lastName: subscriber.lastName, component_id: 3, }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && this.selectedFlatId && userJson && this.selectedComun) {
        const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal_name: this.selectedComun };
        console.log(data)
        try {
          const response: any = await this.http.post(serverPath + '/comunal/delete/button', data).toPromise();
          console.log(response)
          if (response.status === true) {
            this.statusMessage = 'Послуга видалена';
            setTimeout(() => { this.statusMessage = ''; location.reload() }, 2000);
          } else {
            this.statusMessage = 'Щось пішло не так, повторіть спробу';
            setTimeout(() => {
              this.statusMessage = ''; location.reload();
            }, 2000);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

}

