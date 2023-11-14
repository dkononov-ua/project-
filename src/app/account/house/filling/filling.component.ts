import { Component, OnInit } from '@angular/core';
import { objects } from '../../../data/objects-data';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { serverPath } from 'src/app/config/server-config';
@Component({
  selector: 'app-filling',
  templateUrl: './filling.component.html',
  styleUrls: ['./filling.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 0ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})

export class FillingComponent implements OnInit {
  serverPath = serverPath;

  loading = false;

  selectCondition: { [key: number]: string } = {
    0: 'Новий',
    1: 'Задовільний',
    2: 'Пошкоджений',
    3: 'Несправний',
  }

  objects = objects;
  flat_objects!: any;
  filteredObjects: any[] = [];
  selectedType!: string;
  selectedObject: any;
  selectedFlatId!: string | null;
  fillingImg: any;
  selectedIconUrl: string = '';
  selectedCard: boolean = false;
  defaultIcon = '../../../assets/icon-objects/add_circle.png';

  // показ карток
  indexPage: number = 0;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService
  ) { }

  async ngOnInit(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.getInfo();
        this.loadObjects();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');

    if (this.selectedFlatId && userJson) {
      const response = await this.http.post(serverPath + '/flatinfo/get/filling', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
      }).toPromise() as any;
      if (response) {
        this.flat_objects = response.status;
      }
    }
  }

  getImageSource(flat: any): string {
    if (flat.img) {
      return serverPath + '/img/filling/' + flat.img;
    } else {
      return '../../../../assets/icon-objects/default.filling.png';
    }
  }

  selectCard(flat: any): void {
    if (this.selectedCard === flat.filling_id) {
      this.selectedCard = false;
    } else {
      this.selectedCard = flat.filling_id;
    }
  }

  getIconUrl(type: string, name: string): string {
    const selectedTypeObj = this.objects.find(obj => obj.type === type);

    if (selectedTypeObj) {
      const selectedObj = selectedTypeObj.object.find(obj => obj.name === name);
      return selectedObj ? selectedObj.iconUrl : this.defaultIcon;
    } else {
      return this.defaultIcon;
    }
  }

  loadObjects() {
    if (this.selectedType) {
      const selectedTypeObj = this.objects.find(obj => obj.type === this.selectedType);
      this.filteredObjects = selectedTypeObj ? selectedTypeObj.object : [];
      this.selectedObject = null;
    } else {
      this.filteredObjects = [];
      this.selectedObject = null;
    }
  }
}
