// import { Injectable } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })

// export class ValidationService {
//   userForm: any;
//   userFormContacts: any;
//   validateForm(houseCreate: FormGroup<any>, validationMessages: any, formErrors: any): any {
//     throw new Error('Method not implemented.');
//   }

//   errorMessage$ = new Subject<string>();
//   houseCreate: any;
//   houseForm: any;

//   constructor(private fb: FormBuilder) { }
//   formErrors: any = {
//     firstName: '',
//     lastName: '',
//     surName: '',
//     email: '',
//     password: '',
//     dob: '',
//     tell: '',
//     phone_alt: '',
//     telegram: '',
//     facebook: '',
//     instagram: '',
//     mail: '',
//     viber: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',

//     flat_id: '',
//     country: '',
//     region: '',
//     city: '',
//     street: '',
//     houseNumber: '',
//     apartment: '',
//     flat_index: '',
//     private: '',
//     rent: '',
//     live: '',
//     who_live: '',
//     subscribers: '',

//     rooms: '',
//     repair_status: '',
//     area: '',
//     kitchen_area: '',
//     balcony: '',
//     floor: '',
//   };

//   validationMessages: any = {
//     firstName: {
//       required: 'Ім`я обов`язково',
//       minlength: 'Мінімум 3 символи',
//       maxlength: 'Максимальна довжина 15 символів',
//       pattern: 'Тільки літери та пробіли'
//     },
//     lastName: {
//       required: 'Прізвище обов`язково',
//       minlength: 'Мінімум 3 символи',
//       maxlength: 'Максимальна довжина 15 символів',
//       pattern: 'Тільки літери та пробіли'
//     },
//     surName: {
//       required: 'По батькові обов`язково',
//       minlength: 'Мінімум 3 символи',
//       maxlength: 'Максимальна довжина 15 символів',
//       pattern: 'Тільки літери та пробіли'
//     },
//     password: {
//       required: 'Пароль обов`язково',
//       minlength: 'Мінімальна довжина 4 символів',
//       maxlength: 'Максимальна довжина 15 символів'
//     },
//     email: {
//       required: 'Пошта обов`язкова',
//       pattern: 'Невірно вказаний пошта',
//     },
//     dob: {
//       require: 'Це поле є обов`язковим.',
//       min: 'Дата народження повинна бути не раніше 1900-01-01.',
//       max: 'Дата народження повинна бути не пізніше поточної дати.'
//     },
//     tell: {
//       required: 'Телефон не обов`язковий',
//     },
//     phone_alt: {
//       required: 'Телефон додатковий не обов`язковий',
//     },
//     telegram: {
//       required: 'telegram не обов`язковий',
//     },
//     facebook: {
//       required: 'facebook не обов`язковий',
//     },
//     instagram: {
//       required: 'instagram не обов`язковий',
//     },
//     viber: {
//       required: 'viber не обов`язковий',
//     },
//     mail: {
//       required: 'mail не обов`язковий',
//     },

//     flat_id: {
//       required: 'houseId обов`язково',
//       minlength: 'Мінімальна довжина 4 символи',
//       maxlength: 'Максимальна довжина 20 символів',
//     },
//     street: {
//       required: 'Вулиця обов`язкова',
//       minlength: 'Мінімальна довжина 4 символи',
//       maxlength: 'Максимальна довжина 20 символів',
//       pattern: 'Тільки літери та пробіли'
//     },
//     houseNumber: {
//       required: 'Обов`язково',
//       minlength: 'Мінімальна довжина 1 символ',
//       maxlength: 'Максимальна довжина 5 символів',
//     },
//     floor: {
//       required: 'Обов`язково',
//       minlength: 'Мінімальна довжина 1 символ',
//       pattern: 'Не коректно',
//     },
//     apartment: {
//       required: 'Обов`язково',
//       minlength: 'Мінімальна довжина 1 символ',
//       pattern: 'Не коректно',
//     },
//     city: {
//       required: 'Місто обов`язкове',
//       minlength: 'Мінімальна довжина 2 символи',
//       maxlength: 'Максимальна довжина 20 символів',
//       pattern: 'Тільки літери та пробіли'
//     },
//     region: {
//       required: 'Область обов`язкова',
//       minlength: 'Мінімальна довжина 2 символи',
//       maxlength: 'Максимальна довжина 20 символів',
//       pattern: 'Тільки літери та пробіли'
//     },
//     index: {
//       required: 'Індекс обов`язковий',
//       minlength: 'Мінімальна довжина 5 символи',
//       maxlength: 'Максимальна довжина 5 символів',
//       pattern: 'Тільки цифри',
//     },
//   };


//   private initializeForm(): void {
//     this.userForm = this.fb.group({
//       firstName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
//       lastName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
//       surName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
//       password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
//       email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
//       dob: [null, [Validators.required, Validators.min(Date.parse('1900-01-01')), Validators.max(new Date().getTime())]],
//     });

//     this.userFormContacts = this.fb.group({
//       tell: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
//       phone_alt: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
//       facebook: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
//       telegram: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
//       instagram: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
//       viber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
//       mail: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
//     });

//     this.houseCreate = this.fb.group({
//       flat_id: [null, [
//         Validators.required,
//         Validators.minLength(7),
//         Validators.maxLength(20),
//       ]],
//     });
//     this.houseForm = this.fb.group({
//       flat_id: [null, [
//         Validators.required,
//         Validators.minLength(4),
//         Validators.maxLength(20),
//       ]],
//       street: [null, [
//         Validators.required,
//         Validators.minLength(4),
//         Validators.maxLength(20),
//         Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // тільки літери та пробіли
//       ]],
//       houseNumber: [null, [
//         Validators.required,
//         Validators.minLength(1),
//         Validators.maxLength(5),
//       ]],
//       floor: [null, [
//         Validators.required,
//         Validators.minLength(1),
//         Validators.maxLength(100),
//         Validators.pattern(/^[0-9]+$/), // тільки цифри
//       ]],
//       apartment: [null, [
//         Validators.required,
//         Validators.minLength(1),
//         Validators.pattern(/^[0-9]+$/), // тільки цифри
//       ]],
//       city: [null, [
//         Validators.required,
//         Validators.minLength(2),
//         Validators.maxLength(20),
//         Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // тільки літери та пробіли
//       ]],
//       region: [null, [
//         Validators.required,
//         Validators.minLength(2),
//         Validators.maxLength(20),
//         Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // тільки літери та пробіли
//       ]],
//       index: [null, [
//         Validators.required,
//         Validators.minLength(5),
//         Validators.maxLength(5),
//         Validators.pattern(/^[0-9]+$/), // тільки цифри
//       ]],
//     });

//     this.userForm.valueChanges?.subscribe(() => this.onValueChanged());
//     this.userFormContacts.valueChanges?.subscribe(() => this.onValueChanged());


//     this.houseForm.valueChanges?.subscribe(() => this.onValueChanged());
//     this.houseCreate.valueChanges?.subscribe(() => this.onValueChanged());
//   }

//   private onValueChanged() {
//     this.formErrors = {};

//     const userForm = this.userForm;
//     for (const field in userForm.controls) {
//       const control = userForm.get(field);
//       this.formErrors[field] = '';

//       if (control && control.dirty && control.invalid) {
//         const messages = this.validationMessages[field];

//         for (const key in control.errors) {
//           this.formErrors[field] += messages[key] + ' ';
//         }
//       }
//     }

//     const userFormContacts = this.userFormContacts;
//     for (const field in userFormContacts.controls) {
//       const control = userFormContacts.get(field);
//       this.formErrors[field] = '';

//       if (control && control.dirty && control.invalid) {
//         const messages = this.validationMessages[field];

//         for (const key in control.errors) {
//           this.formErrors[field] += messages[key] + ' ';
//         };
//       };
//     };
//   };

//   const houseCreate = this.houseCreate;
//   for(const field in houseCreate.controls) {
//     const control = houseCreate.get(field);
//     this.formErrors[field] = '';

//     if (control && control.dirty && control.invalid) {
//       const messages = this.validationMessages[field];

//       for (const key in control.errors) {
//         this.formErrors[field] += messages[key] + ' ';
//       }
//     }
//   }

//   const houseForm = this.houseForm;
//   for(const field in houseForm.controls) {
//     const control = houseForm.get(field);
//     this.formErrors[field] = '';

//     if (control && control.dirty && control.invalid) {
//       const messages = this.validationMessages[field];

//       for (const key in control.errors) {
//         this.formErrors[field] += messages[key] + ' ';
//       }
//     }
//   }
// }

