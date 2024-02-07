import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { DataService } from 'src/app/services/data.service';
import { animations } from '../../../interface/animation';

interface FlatInfo {
  students: boolean;
  woman: boolean;
  man: boolean;
  family: boolean;
  bunker: string | undefined;
  animals: string | undefined;
  option_pay: number;
  price_d: number;
  price_m: number;
  about: string | undefined;
  private: boolean;
  rent: number;
  room: number;
  price_f: number;
}
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [animations.left, animations.left1, animations.left2,],
})

export class AboutComponent implements OnInit {
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  minValue: number = 0;
  maxValue: number = 1000000;
  loading = false;
  path_logo = path_logo;

  flatInfo: FlatInfo = {
    students: false,
    woman: false,
    man: false,
    family: false,
    bunker: undefined,
    animals: 'Неважливо',
    option_pay: 1,
    price_d: 0,
    price_m: 0,
    price_f: 0.1,
    about: undefined,
    private: false,
    rent: 0,
    room: 0,
  };

  selectedFlatId!: string | null;
  descriptionVisibility: { [key: string]: boolean } = {};
  isDescriptionVisible(key: string): boolean {
    return this.descriptionVisibility[key] || false;
  }
  toggleDescription(key: string): void {
    this.descriptionVisibility[key] = !this.isDescriptionVisible(key);
  }

  helpRent: boolean = false;
  helpRoom: boolean = false;
  helpPriority: boolean = false;
  statusMessage: string | undefined;
  openHelpRent() {
    this.helpRent = !this.helpRent;
  }

  openHelpRoom() {
    this.helpRoom = !this.helpRoom;
  }

  openHelpPriority() {
    this.helpPriority = !this.helpPriority;
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.getSelectParam();
    if (this.selectedFlatId) {
      this.getInfo();
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });
  }

  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.setItem('houseData', JSON.stringify(response));
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }


  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          this.flatInfo = response.about;
          this.loading = false;
        }, (error: any) => {
          console.error(error);
          this.loading = false;
        });
    } else {
      console.log('user not found');
      this.loading = false;
    }
  };

  async saveInfo(rent: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {

      if (this.flatInfo.option_pay === 2) {
        this.flatInfo.price_m = 1;
        this.flatInfo.price_d = 1;
      }

      console.log(this.flatInfo.price_m)

      const data = {
        students: this.flatInfo.students || undefined,
        woman: this.flatInfo.woman || undefined,
        man: this.flatInfo.man || undefined,
        family: this.flatInfo.family || undefined,
        bunker: this.flatInfo.bunker || undefined,
        animals: this.flatInfo.animals || 'Неважливо',
        option_pay: this.flatInfo.option_pay || 0,
        price_d: this.flatInfo.price_d,
        price_m: this.flatInfo.price_m,
        about: this.flatInfo.about || undefined,
        private: this.flatInfo.private || false,
        rent: rent,
        room: this.flatInfo.room || 0,
      }
      console.log(data)
      try {
        const response: any = await this.http.post(serverPath + '/flatinfo/add/about', {
          auth: JSON.parse(userJson),
          flat: data,
          flat_id: this.selectedFlatId,
        }).toPromise();

        if (response && response.status === 'Параметри успішно додані' && this.flatInfo.rent === 1) {
          console.log(response)
          this.updateFlatInfo();
          setTimeout(() => {
            this.statusMessage = 'Оголошення розміщено';
            setTimeout(() => {
              this.statusMessage = 'Оновлюємо інформацію';
              this.reloadPageWithLoader()
              // this.router.navigate(['/house/house-info']);
            }, 1500);
          }, 500);
        } else if (response && response.status === 'Параметри успішно додані' && this.flatInfo.rent === 0) {
          this.updateFlatInfo();
          setTimeout(() => {
            this.statusMessage = 'Параметри успішно додані, оголошення НЕ активне';
            setTimeout(() => {
              this.statusMessage = 'Оновлюємо інформацію';
              this.reloadPageWithLoader()

              // this.router.navigate(['/house/house-info']);
            }, 1500);
          }, 500);
        } else {
          setTimeout(() => {
            this.statusMessage = 'Помилка збереження';
            setTimeout(() => {
              this.statusMessage = '';
            }, 1500);
          }, 500);
        }

      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    } else {
      this.loading = false;
      console.log('user not found, the form is blocked');
    }
  }

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  ngAfterViewInit() {
    this.textArea.nativeElement.style.height = 'auto';
    this.textArea.nativeElement.style.height = this.textArea.nativeElement.scrollHeight + 'px';
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  clearInfo(): void {
    this.flatInfo = {
      students: false,
      woman: false,
      man: false,
      family: false,
      bunker: '',
      animals: 'Неважливо',
      option_pay: 0,
      price_d: 0,
      price_m: 0,
      price_f: 0,
      about: '',
      private: false,
      rent: 0,
      room: 0,

    };
  }
}
