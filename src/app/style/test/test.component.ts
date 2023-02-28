import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  userForm: FormGroup = new FormGroup<any>({
    name: new FormControl(),
    password: new FormControl()
  }
  )

  onSubmit(): void {
    console.log('Form submitted');
    console.log(this.userForm.value);
  }


}




