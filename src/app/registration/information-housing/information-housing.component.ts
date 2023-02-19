import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-information-housing',
  templateUrl: './information-housing.component.html',
  styleUrls: ['./information-housing.component.scss']
})
export class InformationHousingComponent {

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // додаткові дії з файлом, які вам потрібні
  }

  imageUrl = 'https://via.placeholder.com/300';
  formData: any = {};

  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;

  ngOnInit() {
    // Код для ініціалізації мапи
  }

  onSubmit() {
    // Код для обробки подання форми
  }
};


