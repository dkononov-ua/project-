import { Component, OnInit } from '@angular/core';
import { objects } from '../../../../shared/objects-data';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-download-filling',
  templateUrl: './download-filling.component.html',
  styleUrls: ['./download-filling.component.scss'],
})

export class DownloadFillingComponent implements OnInit {

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
  defaultIcon = '../../../assets/icon-objects/add_circle.png';
  printOpen: boolean = false;
  houseData: any;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private dataService: DataService,) { }

  async ngOnInit(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.getInfo();
        this.loadObjects();
        this.getHouse();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');

    if (this.selectedFlatId && userJson) {
      const response = await this.http.post('http://localhost:3000/flatinfo/get/filling', {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
      }).toPromise() as any;
      if (response) {
        console.log(response.status)
        this.flat_objects = response.status;
      }
    }
  }

  async getHouse(): Promise<void> {
    try {
      const response: any = await this.dataService.getData().toPromise();
      this.houseData = response.houseData;
      if (this.houseData.imgs === 'Картинок нема') {
        this.houseData.imgs = ['http://localhost:3000/img/flat/housing_default.svg'];
      }
    } catch (error) {
      console.error(error);
    }
  }

  getImageSource(flat: any): string {
    if (flat.img) {
      return 'http://localhost:3000/img/filling/' + flat.img;
    } else {
      return '../../../../assets/icon-objects/default.filling.png';
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

  printContainer(): void {
    const printContainer = document.querySelector('.print-container');
    if (!printContainer) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      const headContent = `
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Discussio Agree</title>
          <style>

          .print-container {
            position: relative;
            width: 100%;
            background-color: white;
            padding: 10px 10px;
            font-family: 'Montserrat', sans-serif;
          }

          .container-card {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-evenly;
            font-family: 'Montserrat', sans-serif;
          }

          .card-group {
            display: flex;
            flex-flow: row wrap;
            align-items: stretch;
            justify-content: space-around;
            position: relative;
            flex-direction: column;
          }

          .box {
            display: flex;
          }

          .box-filling::-webkit-scrollbar {
            display: none;
          }

          .box-filling {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            max-height: 80vh;
            overflow: auto;
          }
          .card-box {
            display: flex;
          }

          .card-filling {
            cursor: pointer;
            width: 47%;
            display: flex;
            background-color: white;
            color: rgba(0, 0, 0, 0.8117647059);
            border-radius: 10px;
            border: 1px solid gray;
            justify-content: space-between;
            transition: 1s;
            flex-direction: column;

            &:hover {
              transform: scale(1.05);
            }
          }
          .box-img {
            position: relative;
          }
          .card-img {
            border-radius: 10px;
            width: 120px;
            height: 100px;
          }
          .icon {
            position: absolute;
            background-color: white;
            top: 35%;
            left: -10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid tomato;
            padding: 5px;
            z-index: 99;
          }
          .card-body {
            display: flex;
            padding: 5px 10px 5px 5px;
            flex-direction: column;
            align-items: stretch;
            position: relative;
          }

          .card-title {
            font-size: 14px;
          }

          .card-title-about {
            font-size: 12px;
          }
          .accent {
            font-weight: 600;
          }
          .item-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-direction: column;
            background-color: #DEDEDE;
            border-radius: 10px;
          }
          .p-3 {
            padding: 20px;
          }

          .mt-3 {
            margin-top: 20px;
          }

          .m-2 {
            margin: 10px;
          }

          .m-1 {
            margin: 5px;
          }

          .p-2 {
            padding: 10px;
          }



.title-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 150px;
  height: 150px;
}

.logo-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  z-index: 5;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
}

.logo-name {
  font-size: 30px;
  color: $color-text;
}
          </style>

        </head>
      `;
      const bodyContent = `
        <body>
          ${printContainer.outerHTML}
        </body>
      `;
      doc.write(`<html>${headContent}${bodyContent}</html>`);
      doc.close();

      iframe.onload = () => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      };
    }
  }
}
