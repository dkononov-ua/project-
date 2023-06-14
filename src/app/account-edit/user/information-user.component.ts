import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-information-user',
  templateUrl: './information-user.component.html',
  styleUrls: ['./information-user.component.scss']
})
export class InformationUserComponent implements OnInit {
  loading = false;

  showPassword = false;
  isPasswordVisible = false;
  passwordType = 'password';

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  userForm!: FormGroup;
  userFormContacts!: FormGroup;
  errorMessage$ = new Subject<string>();
  selectedFile!: File;
  selectedFlatId: any;
  userImg: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private dataService: DataService) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    const userJson = localStorage.getItem('user');

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('auth', JSON.stringify(JSON.parse(userJson!)));

    const headers = { 'Accept': 'application/json' };
    this.http.post('http://localhost:3000/img/uploaduser', formData, { headers }).subscribe(
      (data: any) => {
        this.userImg = data.imgUrl; // Припустимо, що сервер повертає URL завантаженого фото
        setTimeout(() => {
          this.reloadPageWithLoader();
        },);
      },
      error => console.log(error)
    );
  }


  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  };

  ngOnInit(): void {
    console.log('Пройшла перевірка користувача')
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          this.userForm = this.fb.group({
            firstName: [response.inf.firstName],
            lastName: [response.inf.lastName],
            email: [response.inf.email],
            surName: [response.inf.surName],
            dob: [response.inf.dob],
            password: [response.inf.password],
          });
          this.userForm.disable();
        }, (error: any) => {
          console.error(error);
        });

      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          console.log(response);
          this.userImg = response.img[0].img;
          this.userFormContacts = this.fb.group({
            tell: [response.cont.tell],
            phone_alt: [response.cont.phone_alt],
            viber: [response.cont.viber],
            telegram: [response.cont.telegram],
            facebook: [response.cont.facebook],
            instagram: [response.cont.instagram],
            mail: [response.cont.mail],
          });

          // блокуємо форму при оновленні сторінки
        }, (error: any) => {
          console.error(error);
        });

    } else {
      console.log('user not found');
    }
    this.initializeForm();
  }

  // зберігаємо інфо користувача
  onSubmitSaveUserData(): void {
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      this.http.post('http://localhost:3000/add/user', { auth: JSON.parse(userJson), new: this.userForm.value })
        .subscribe((response: any) => {
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('не вийшло зберегти');
    }
  }

  // зберігаємо контактні дані
  onSubmitSaveUserFormContacts(): void {
    console.log(this.userFormContacts.value)
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      this.http.post('http://localhost:3000/add/contacts', { auth: JSON.parse(userJson), new: this.userFormContacts.value })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('Error retrieving data');
    }
  }

  saveUserData(): void {
    this.userForm.disable();
  }

  editUserData(): void {
    this.userForm.enable();
  }

  resetUserForm() {
    this.userForm.reset();
  }

  resetUserFormContacts() {
    this.userFormContacts.reset();
  }

  logout() {
    this.authService.logout();
    setTimeout(() => {
      this.reloadPageWithLoader();
    },);
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      lastName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      surName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      dob: [null],
    });

    this.userFormContacts = this.fb.group({
      tell: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      phone_alt: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      facebook: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      telegram: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      instagram: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      viber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      mail: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
    });
  };
};
