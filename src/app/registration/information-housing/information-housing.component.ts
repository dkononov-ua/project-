import { Component } from '@angular/core';

@Component({
  selector: 'app-information-housing',
  templateUrl: './information-housing.component.html',
  styleUrls: ['./information-housing.component.scss']
})
export class InformationHousingComponent {
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
};


