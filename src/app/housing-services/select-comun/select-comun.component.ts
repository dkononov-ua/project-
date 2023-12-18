import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeComunService } from '../change-comun.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DiscussioViewService } from 'src/app/services/discussio-view.service';
import { ViewComunService } from 'src/app/services/view-comun.service';
import { serverPath } from 'src/app/config/server-config';

@Component({
  selector: 'app-select-comun',
  templateUrl: './select-comun.component.html',
  styleUrls: ['./select-comun.component.scss'],
})
export class SelectComunComponent implements OnInit {

  popular_comunal_names = [
    "Опалення",
    "Водопостачання",
    "Вивіз сміття",
    "Електроенергія",
    "Газопостачання",
    "Комунальна плата за утримання будинку",
    "Охорона будинку",
    "Ремонт під'їзду",
    "Ліфт",
    "Інтернет та телебачення",
    "Домофон",
  ];

  loading = false;
  showInput = false;

  selectedComun: any;
  selectedFlatId!: string | null;
  comunal_name!: string | any;
  discussio_view: boolean = false;

  selectedView: any;
  selectedName: string | null | undefined;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private changeComunService: ChangeComunService,
    private selectedFlatService: SelectedFlatService,
    private discussioViewService: DiscussioViewService,
    private selectedViewComun: ViewComunService,
  ) { }

  ngOnInit(): void {
    this.getSelectParam()
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

  onSelectionChangeComun(): void {
    this.changeComunService.setSelectedComun(this.selectedComun);
  }

  getComunalName(): void {
    const userJson = localStorage.getItem('user');

    if (!userJson) {
      console.error('LocalStorage не містить дані користувача');
      return;
    }

    const requestData = {
      auth: JSON.parse(userJson),
      flat_id: this.selectedFlatId,
    };
    this.http.post(serverPath + '/comunal/get/button', requestData)
      .subscribe(
        (response: any) => {
          if (response.status === false) {
            return;
          }
          const firstComunal = response.comunal[0];
          if (firstComunal && firstComunal.iban !== undefined) {
            this.discussio_view = false;
            this.discussioViewService.setDiscussioView(this.discussio_view);
            this.comunal_name = response.comunal;
          } else if (firstComunal && firstComunal.iban === undefined) {
            this.discussio_view = true;
            this.discussioViewService.setDiscussioView(this.discussio_view);
            this.comunal_name = response.comunal;
          }
        },
        (error: any) => {
          console.error('Помилка при отриманні даних: ', error);
        }
      );
  }

}

