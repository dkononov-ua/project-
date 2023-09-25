import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangeComunService } from '../change-comun.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DeleteComunComponent } from '../delete-comun/delete-comun.component';
import { ActivatedRoute } from '@angular/router';
import { DiscussioViewService } from 'src/app/services/discussio-view.service';
import { ViewComunService } from 'src/app/services/view-comun.service';
@Component({
  selector: 'app-host-comun',
  templateUrl: './host-comun.component.html',
  styleUrls: ['./host-comun.component.scss'],
})
export class HostComunComponent implements OnInit {

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
  customComunal: string = '';
  discussioFlat: any;
  discussio_view: boolean = false;
  selectedView: string | null | undefined;
  selectedName: string | null | undefined;

  isMenuOpen = true;
  hideMenu = false;

  onToggleMenu() {
    if (this.isMenuOpen) {
      this.openMenu();
      setTimeout(() => {
        this.hideMenu = !this.hideMenu;
      }, 500);
    } else {
      this.hideMenu = !this.hideMenu;
      setTimeout(() => {
        this.openMenu();
      }, 100);
    }
  }

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private changeComunService: ChangeComunService,
    private selectedFlatService: SelectedFlatService,
    private route: ActivatedRoute,
    private discussioViewService: DiscussioViewService,
    private selectedViewComun: ViewComunService,
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
      console.log(this.selectedView)
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName;
      console.log(this.selectedName)
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
      const selectedComun = this.selectedComun || this.customComunal;
      if (selectedComun) {
        this.http.post('http://localhost:3000/comunal/add/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: selectedComun })
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
          this.http.post('http://localhost:3000/comunal/delete/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal_name: this.selectedComun })
            .subscribe((response: any) => {
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
