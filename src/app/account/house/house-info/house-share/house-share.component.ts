import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath } from 'src/app/config/server-config';
interface FlatInfo {
  osbb_name: string | undefined;
  osbb_phone: any;
  pay_card: any;
  wifi: any;
  info_about: string | undefined;
}

@Component({
  selector: 'app-house-share',
  templateUrl: './house-share.component.html',
  styleUrls: ['./house-share.component.scss'],
})

export class HouseShareComponent implements OnInit {
  serverPath = serverPath;

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  loading = false;
  isCopiedMessage!: string;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  flatInfo: FlatInfo = {
    osbb_name: '',
    osbb_phone: '',
    pay_card: '',
    wifi: '',
    info_about: '',
  };

  disabled: boolean = true;
  selectedFlatId!: string | null;
  phonePattern = '^[0-9]{10}$';

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
  authorization: boolean = false;
  houseData: any;

  formatCreditCard(event: any) {
    let input = event.target.value;
    input = input.replace(/\D/g, '');

    if (input.length > 16) {
      input = input.slice(0, 16);
    }

    if (input.length > 0) {
      input = input.match(new RegExp('.{1,4}', 'g')).join(' ');
    }

    this.flatInfo.pay_card = input;
  }


  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService) {
  }

  ngOnInit(): void {
    this.getSelectedFlatId();
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        this.getInfo();
        const houseData = localStorage.getItem('houseData');
        if (houseData) {
          const parsedHouseData = JSON.parse(houseData);
          this.houseData = parsedHouseData;
          if (this.houseData) {
            this.getHouseAcces();
          }
        } else {
          console.log('Оберіть оселю')
        }
      }
    });
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.http.post(serverPath + '/flatinfo/get/flatinf', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          if (response)
            this.flatInfo = response[0];
          this.loading = false;
        }, (error: any) => {
          console.error(error);
          this.loading = false;
        });
    } else {
      console.log('house not found');
      this.loading = false;
    }
  };

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      try {
        this.loading = true
        this.disabled = true;

        const response = await this.http.post(serverPath + '/flatinfo/add/flatinf', {
          auth: JSON.parse(userJson),
          new: this.flatInfo,
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

  clearInfo(): void {
    this.flatInfo = {
      osbb_name: '',
      osbb_phone: '',
      pay_card: '',
      wifi: '',
      info_about: '',
    };
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

  copyWiFi() { this.copyToClipboard(this.flatInfo.wifi, 'WiFi пароль скопійовано'); }
  copyOsbbPhone() { this.copyToClipboard(this.flatInfo.osbb_phone, 'Номер телефону скопійовано'); }
  copyPayCard() { this.copyToClipboard(this.flatInfo.pay_card, 'Номер картки скопійовано'); }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
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
