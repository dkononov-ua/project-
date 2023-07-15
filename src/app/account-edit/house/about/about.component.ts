import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HostComponent } from '../host/host.component';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

interface FlatInfo {
  students: boolean;
  woman: boolean;
  man: boolean;
  family: boolean;
  bunker: string | undefined;
  animals: string | undefined;
  distance_parking: number;
  distance_metro: number;
  distance_stop: number;
  distance_green: number;
  distance_shop: number;
  optionPay: any;
  price_d: number;
  price_m: number;
  price_y: number;
  about: string | undefined;
  private: boolean;
  rent: boolean;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(165%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;

  flatInfo: FlatInfo = {
    students: false,
    woman: false,
    man: false,
    family: false,
    bunker: undefined,
    animals: undefined,
    distance_parking: 0,
    distance_metro: 0,
    distance_stop: 0,
    distance_green: 0,
    distance_shop: 0,
    optionPay: undefined,
    price_d: 0,
    price_m: 0,
    price_y: 0,
    about: undefined,
    private: false,
    rent: false,
  };

  disabled: boolean = true;
  selectedFlatId!: string | null;

  constructor(private http: HttpClient, private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      console.log(this.selectedFlatId);
      if (this.selectedFlatId !== null) {
        this.getInfo();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          this.flatInfo = response.about;
          console.log(this.flatInfo);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  };

  saveInfo(): void {
    this.disabled = true;
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      const data = this.flatInfo;
      console.log(data)
      this.http.post('http://localhost:3000/flatinfo/add/about', { auth: JSON.parse(userJson), flat: data, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
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
    this.flatInfo = {
      students: false,
      woman: false,
      man: false,
      family: false,
      bunker: '',
      animals: '',
      distance_parking: 0,
      distance_metro: 0,
      distance_stop: 0,
      distance_green: 0,
      distance_shop: 0,
      optionPay: null,
      price_d: 0,
      price_m: 0,
      price_y: 0,
      about: '',
      private: false,
      rent: false,
    };
  }
}
