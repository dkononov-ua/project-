import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { animations } from '../../../interface/animation';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

interface FlatInfo {
  osbb_name: string | undefined;
  osbb_phone: string | undefined;
  pay_card: string | undefined;
  wifi: string | undefined;
  info_about: string | undefined;
}

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
  animations: [animations.left, animations.left1, animations.left2,],
})

export class AdditionalInfoComponent implements OnInit {
  serverPath = serverPath;
  path_logo = path_logo;

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
    osbb_phone: '',
    pay_card: '',
    wifi: '',
    info_about: '',
  };

  disabled: boolean = true;
  selectedFlatId!: string | null;
  phonePattern = '^[0-9]{10}$';

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
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.getSelectedFlatId();
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        this.getInfo();
      } else {
        console.log('no flat')
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
        const response: any = await this.http.post(serverPath + '/flatinfo/add/flatinf', {
          auth: JSON.parse(userJson),
          new: this.flatInfo,
          flat_id: this.selectedFlatId,
        }).toPromise();
        // if (response.status === 'Збережено') {
        if (response.status) {
          this.sharedService.setStatusMessage("Допоміжна інформація збережена");
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.router.navigate(['/house/house-info']);
            // this.getInfo();
            // this.loading = false;
          }, 2000);
        } else {
          this.sharedService.setStatusMessage("Помилка збереження");
          this.reloadPageWithLoader()
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

  clearInfo(): void {
    this.flatInfo = {
      osbb_name: '',
      osbb_phone: '',
      pay_card: '',
      wifi: '',
      info_about: '',
    };
  }

}
