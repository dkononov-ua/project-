import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  modal: any;
  openModal() {
    this.modal.showModal = true;
  }

  name: string | undefined;
  email: string | undefined;
  agreement: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('assets/agreement.txt', {responseType: 'text'}).subscribe(
      (      data: string) => this.agreement = data,
      (      error: any) => console.error(error)
    );
  }

}




