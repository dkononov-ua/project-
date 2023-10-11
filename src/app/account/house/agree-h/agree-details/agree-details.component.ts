import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/shared/server-config';

@Component({
  selector: 'app-agree-details',
  templateUrl: './agree-details.component.html',
  styleUrls: ['./agree-details.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class AgreeDetailsComponent implements OnInit {
  serverPath = serverPath;
  path_logo = path_logo;

  selectedFlatAgree: any;
  selectedAgreement: any;
  selectedFlatId: any;
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });

    this.route.params.subscribe(async params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
      this.selectedAgreement = await this.getAgree();
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
      const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === this.selectedFlatAgree);
      console.log(selectedAgreement)
      return selectedAgreement || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}




