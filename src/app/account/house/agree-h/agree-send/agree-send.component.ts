import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { Location } from '@angular/common';
import { serverPath, path_logo } from 'src/app/config/server-config';

@Component({
  selector: 'app-agree-send',
  templateUrl: './agree-send.component.html',
  styleUrls: ['./agree-send.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class AgreeSendComponent implements OnInit {
  serverPath = serverPath;
  path_logo = path_logo;
  selectedFlatAgree: any;
  selectedAgreement: any;
  selectedFlatId: any;
  loading: boolean = true;

  goBack(): void {
    this.location.back();
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });

    this.route.params.subscribe(async params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
      this.selectedAgreement = await this.getAgree();
      if (!this.selectedAgreement) {
        this.selectedAgreement = await this.getAgreeConcluded();
      }
    });
    this.loading = false;
  }

  async getAgree(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/agreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      offs: 0
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as any[];
      if (response) {
        const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === this.selectedFlatAgree);
        return selectedAgreement || null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAgreeConcluded(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/agreement/get/saveagreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      offs: 0
    };
    console.log('download-house')

    try {
      const response = (await this.http.post(url, data).toPromise()) as any[];
      const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === this.selectedFlatAgree);
      this.loading = false;
      return selectedAgreement || null;
    } catch (error) {
      this.loading = false;
      console.error(error);
      return null;
    }
  }

}



