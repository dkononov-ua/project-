import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
  agreementText: string | undefined;
  name: string | undefined;
  email: string | undefined;
  agreeToTerms: boolean | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('assets/agreement.txt', {responseType: 'text'}).subscribe(data => {
      this.agreementText = data;
    });
  }

  onSubmit() {
    // Handle form submission
  }
}
