import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { serverPath, path_logo } from 'src/app/shared/server-config';

registerLocaleData(localeUk);
@Component({
  selector: 'app-uagree-download',
  templateUrl: './uagree-download.component.html',
  styleUrls: ['./uagree-download.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
})

export class UagreeDownloadComponent implements OnInit {

  serverPath = serverPath;
  path_logo = path_logo;
  loading: boolean = false;

  houseData: any;
  userData: any;
  selectedFlatAgree: any;
  selectedAgreement: any;
  printableContent: SafeHtml | undefined;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
      this.selectedAgreement = await this.getAgree(this.selectedFlatAgree);
    });
    this.loadData();
    this.loading = false;
  }

  loadData(): void {
    this.dataService.getInfoFlat().subscribe(
      (response: any) => {
        this.houseData = response;
      },
      (error) => {
        console.error(error);
      }
    );

    this.dataService.getInfoUser().subscribe(
      (response: any) => {
        this.userData = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async getAgree(selectedFlatAgree: string): Promise<any> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/agreement/get/saveyagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as any[];
      const selectedAgreement = response.find((agreement) => agreement.flat.agreement_id === selectedFlatAgree);
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
      setTimeout(() => {
        window.print();
      });
    }
  }

  goBack() {
    this.router.navigate(['/user/uagree-menu'], { queryParams: { indexPage: 3 } });
  }

}

