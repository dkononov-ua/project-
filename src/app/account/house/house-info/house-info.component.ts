import { Component, HostListener, OnInit } from '@angular/core';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { HouseInfo } from '../../../interface/info';
import { HouseConfig } from '../../../interface/param-config';
import { Options, Distance, Animals, CheckBox } from '../../../interface/name';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-house-info',
  templateUrl: './house-info.component.html',
  styleUrls: ['./house-info.component.scss'],
  animations: [
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.right2,
    animations.right4,
    animations.swichCard,
  ],
})

export class HouseInfoComponent implements OnInit {

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  isOpen = true;
  isCopied = false;
  indexPage: number = 1;
  loading: boolean = false;
  houseData: any;

  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;

  HouseInfo: HouseInfo = HouseConfig;
  options: { [key: number]: string } = Options;

  currentPhotoIndex: number = 0;
  showCardParam: number = 0;
  prevPhoto() {
    this.currentPhotoIndex--;
  }
  nextPhoto() {
    this.currentPhotoIndex++;
  }

  isCopiedMessage!: string;
  public locationLink: string = '';
  statusMessage: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateindexPageBasedOnWindowSize();
  }

  constructor() { }

  async ngOnInit(): Promise<void> {
    this.loadDataFlat();
    await this.cardParam();
    this.updateindexPageBasedOnWindowSize();
  }

  cardParam() {
    if (this.HouseInfo.rent === 1) {
      this.showCardParam = 1;
    } else {
      this.showCardParam = 2;
    }
  }

  // перевірка ширини екрану
  private updateindexPageBasedOnWindowSize(): void {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 768) {
      this.indexPage = 2;
    } else {
      this.indexPage = 1;
    }
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.houseData = parsedHouseData;
        if (this.houseData) {
          this.getHouseAcces();
        }
        this.HouseInfo.region = parsedHouseData.flat.region;
        this.HouseInfo.flat_id = parsedHouseData.flat.flat_id;
        this.HouseInfo.country = parsedHouseData.flat.country;
        this.HouseInfo.city = parsedHouseData.flat.city;
        this.HouseInfo.street = parsedHouseData.flat.street;
        this.HouseInfo.houseNumber = parsedHouseData.flat.houseNumber;
        this.HouseInfo.apartment = parsedHouseData.flat.apartment;
        this.HouseInfo.flat_index = parsedHouseData.flat.flat_index;
        this.HouseInfo.private = parsedHouseData.flat.private;
        this.HouseInfo.rent = parsedHouseData.about.rent;
        this.HouseInfo.rooms = parsedHouseData.param.rooms;
        this.HouseInfo.repair_status = parsedHouseData.param.repair_status;
        this.HouseInfo.area = parsedHouseData.param.area;
        this.HouseInfo.kitchen_area = parsedHouseData.param.kitchen_area;
        this.HouseInfo.balcony = parsedHouseData.param.balcony;
        this.HouseInfo.floor = parsedHouseData.param.floor;
        this.HouseInfo.distance_metro = parsedHouseData.about.distance_metro;
        this.HouseInfo.distance_stop = parsedHouseData.about.distance_stop;
        this.HouseInfo.distance_shop = parsedHouseData.about.distance_shop;
        this.HouseInfo.distance_green = parsedHouseData.about.distance_green;
        this.HouseInfo.distance_parking = parsedHouseData.about.distance_parking;
        this.HouseInfo.woman = parsedHouseData.about.woman;
        this.HouseInfo.man = parsedHouseData.about.man;
        this.HouseInfo.family = parsedHouseData.about.family;
        this.HouseInfo.students = parsedHouseData.about.students;
        this.HouseInfo.option_pay = parsedHouseData.about.option_pay;
        this.HouseInfo.animals = parsedHouseData.about.animals;
        this.HouseInfo.price_m = parsedHouseData.about.price_m;
        this.HouseInfo.price_d = parsedHouseData.about.price_d;
        this.HouseInfo.about = parsedHouseData.about.about;
        this.HouseInfo.bunker = parsedHouseData.about.bunker;
        if (Array.isArray(parsedHouseData.imgs) && parsedHouseData.imgs.length > 0) {
          this.HouseInfo.photos = parsedHouseData.imgs;
        } else {
          this.HouseInfo.photos[0] = "housing_default.svg";
        }
        this.generateLocationUrl();
      } else {
        // console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }
  // Генерую локацію оселі
  generateLocationUrl() {
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = this.HouseInfo.region || '';
    const city = this.HouseInfo.city || '';
    const street = this.HouseInfo.street || '';
    const houseNumber = this.HouseInfo.houseNumber || '';
    const flatIndex = this.HouseInfo.flat_index || '';
    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);
    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;
    return this.locationLink;
  }

  // Відкриваю локацію на мапі
  openMap() {
    this.statusMessage = 'Відкриваємо локаці на мапі';
    setTimeout(() => { this.statusMessage = ''; window.open(this.locationLink, '_blank'); }, 2000);
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.isCopiedMessage = message;
          setTimeout(() => {
            this.isCopiedMessage = '';
          }, 2000);
        })
        .catch((error) => {
          this.isCopiedMessage = '';
        });
    }
  }

  copyFlatId() {
    this.copyToClipboard(this.HouseInfo.flat_id, 'ID оселі скопійовано');
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  getHouseAcces(): void {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
    }
  }

}


