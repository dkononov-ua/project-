import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/shared/server-config';

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
}
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
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
    animals: undefined,
    option_pay: 0,
    price_d: 0,
    price_m: 0,
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
    private router: Router) { }

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

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {

      const data = {
        students: this.flatInfo.students || undefined,
        woman: this.flatInfo.woman || undefined,
        man: this.flatInfo.man || undefined,
        family: this.flatInfo.family || undefined,
        bunker: this.flatInfo.bunker || undefined,
        animals: this.flatInfo.animals || undefined,
        option_pay: this.flatInfo.option_pay || 0,
        price_d: this.flatInfo.price_d || undefined,
        price_m: this.flatInfo.price_m || undefined,
        about: this.flatInfo.about || undefined,
        private: this.flatInfo.private || false,
        rent: this.flatInfo.rent || 0,
        room: this.flatInfo.room || 0,
      }
      try {
        const response: any = await this.http.post(serverPath + '/flatinfo/add/about', {
          auth: JSON.parse(userJson),
          flat: data,
          flat_id: this.selectedFlatId,
        }).toPromise();

        if (response && response.status === 'Параметри успішно додані' && this.flatInfo.rent === 1) {
          setTimeout(() => {
            this.statusMessage = 'Оголошення розміщено';
            setTimeout(() => {
              this.statusMessage = '';
              this.router.navigate(['/house/house-info']);
            }, 1500);
          }, 500);
        } else if (response && response.status === 'Параметри успішно додані' && this.flatInfo.rent === 0) {
          setTimeout(() => {
            this.statusMessage = 'Параметри успішно додані, оголошення приховане';
            setTimeout(() => {
              this.statusMessage = '';
              this.router.navigate(['/house/house-info']);
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
    if (this.loading) {
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
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
      animals: '',
      option_pay: 0,
      price_d: 0,
      price_m: 0,
      about: '',
      private: false,
      rent: 0,
      room: 0,
    };
  }
}
