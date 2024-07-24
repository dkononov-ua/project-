import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'registration', pathMatch: 'full' },
      { path: 'registration', component: RegistrationComponent, data: { title: 'Реєстрація на сайті Discussio™. Платформа для управління нерухомістю. Пошук оселі та орендарів!', description: 'Зареєструватись на нащому сайті', name: 'keywords', content: 'Discussio, реєстрація, зареєструватись, створити профіль, registration' }, },
      { path: 'login', component: LoginComponent, data: { title: 'Вхід на сайт Discussio™. Платформа для управління нерухомістю. Пошук оселі та орендарів!', description: 'Увійдіть в свій профіль Discussio', name: 'keywords', content: 'Discussio, Вхід, вхід, Логін, логін, Login, зайти' }, },
      { path: 'change-password', component: ChangePasswordComponent, data: { title: 'Зміна паролю', description: 'Зміна паролю'} },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
