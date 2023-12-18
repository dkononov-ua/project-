import { Component } from '@angular/core';

@Component({
  selector: 'app-user-payment',
  templateUrl: './user-payment.component.html',
  styleUrls: ['./user-payment.component.scss']
})
export class UserPaymentComponent {
  files: FileList | undefined;

  onSubmit() {
    // код для обробки подання форми
  }

  onFileSelected(event: any) {
    this.files = event.target.files;
  }

  onUpload() {
    // Код для завантаження файлів на сервер та додавання їх до каруселі
  }

  onDelete() {
    // Код для видалення вибраних файлів з каруселі
  }
}
