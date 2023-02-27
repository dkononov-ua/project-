import { Component } from '@angular/core';

@Component({
  selector: 'app-information-user',
  templateUrl: './information-user.component.html',
  styleUrls: ['./information-user.component.scss']
})
export class InformationUserComponent {
  files: FileList | undefined;

  onSubmit() {
  }

  onFileSelected(event: any) {
    this.files = event.target.files;
  }

  onUpload() {
  }

  onDelete() {
  }
};
