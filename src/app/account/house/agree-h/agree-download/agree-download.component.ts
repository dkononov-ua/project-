import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-agree-download',
  templateUrl: './agree-download.component.html',
  styleUrls: ['./agree-download.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class AgreeDownloadComponent implements OnInit {
  selectedFlatAgree: any;
  selectedAgreement: any;
  selectedFlatId: any;
  printableContent: SafeHtml | undefined;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private selectedFlatIdService: SelectedFlatService,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit(): Promise<void> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });

    this.route.params.subscribe(async params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
      this.selectedAgreement = await this.getAgree();
    });
  }

  async getAgree(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/agreement/get/saveagreements';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      offs: 0
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as any[];
      const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === this.selectedFlatAgree);

      return selectedAgreement || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  print(): void {
    const printContainer = document.querySelector('.print-only');
    if (printContainer) {
      this.printableContent = this.sanitizer.bypassSecurityTrustHtml(printContainer.innerHTML);
      const filename = 'ugoda';
      setTimeout(() => {
        window.print();
      });
    }
  }
}



