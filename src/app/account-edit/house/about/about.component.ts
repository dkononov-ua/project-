import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
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
  rent: boolean;
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
    rent: false,
    room: 0,
  };

  disabled: boolean = true;
  selectedFlatId!: string | null;
  descriptionVisibility: { [key: string]: boolean } = {};
  isDescriptionVisible(key: string): boolean {
    return this.descriptionVisibility[key] || false;
  }
  toggleDescription(key: string): void {
    this.descriptionVisibility[key] = !this.isDescriptionVisible(key);
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService) { }

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
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response)
          this.flatInfo = response.about;
          this.loading = false;
          if (response.about.option_pay !== 0)
            this.disabled = false;
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
    if (userJson && this.selectedFlatId !== undefined && this.disabled === false) {

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
        rent: this.flatInfo.rent || false,
        room: this.flatInfo.room || 0,
      }

      console.log(data)
      try {
        this.loading = true
        this.disabled = true;
        const response = await this.http.post('http://localhost:3000/flatinfo/add/about', {
          auth: JSON.parse(userJson),
          flat: data,
          flat_id: this.selectedFlatId,
        }).toPromise();

        this.reloadPageWithLoader()
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

  editInfo(): void {
    this.disabled = false;
  }

  clearInfo(): void {
    if (this.disabled === false)
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
        rent: false,
        room: 0,
      };
  }
}
