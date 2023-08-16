import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

interface FlatInfo {
  osbb_name: string | undefined;
  osbb_phone: number;
  pay_card: number;
  wifi: string | undefined;
  info_about: string | undefined;
}

@Component({
  selector: 'app-house-share',
  templateUrl: './house-share.component.html',
  styleUrls: ['./house-share.component.scss'],
})

export class HouseShareComponent implements OnInit {
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;
  loading = false;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  flatInfo: FlatInfo = {
    osbb_name: '',
    osbb_phone: 0,
    pay_card: 0,
    wifi: '',
    info_about: '',
  };

  disabled: boolean = true;
  selectedFlatId!: string | null;
  phonePattern = '^[0-9]{10}$';

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService) {
  }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
    });
    this.getInfo();
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.http.post('http://localhost:3000/flatinfo/get/flatinf', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response)
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
    if (userJson && this.selectedFlatId !== undefined && this.disabled === false) {

      try {
        this.loading = true
        this.disabled = true;

        const response = await this.http.post('http://localhost:3000/flatinfo/add/flatinf', {
          auth: JSON.parse(userJson),
          new: this.flatInfo,
          flat_id: this.selectedFlatId,
        }).toPromise();
        console.log(response)

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

  editInfo(): void {
    this.disabled = false;
  }

  clearInfo(): void {
    if (this.disabled === false)
      this.flatInfo = {
        osbb_name: '',
        osbb_phone: 0,
        pay_card: 0,
        wifi: '',
        info_about: '',
      };
  }
}

