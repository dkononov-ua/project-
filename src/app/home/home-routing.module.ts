import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportUsComponent } from '../pages/support-us/support-us.component';
import { HomeComponent } from './home.component';
import { AboutProjectComponent } from '../pages/about-project/about-project.component';
import { OpportunitiesComponent } from '../pages/opportunities/opportunities.component';
import { OurTeamComponent } from '../pages/our-team/our-team.component';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { UserLicenceComponent } from '../pages/user-licence/user-licence.component';
import { FeedbackComponent } from '../pages/feedback/feedback.component';
import { UpdateInfoComponent } from '../pages/update-info/update-info.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'about-project', pathMatch: 'full' },
      { path: 'support-us', data: { title: 'Підтримайте наш проект Discussio™ платформу для управління нерухомістю.', description: 'Підтримайте наш проект ми розвиваємось разом з Вами!', name: 'keywords', content: 'Оренда нерухомості, оренда, аренда, купівля, орендарі, Україна, пошук нерухомості, пошук орендарів, орендар' }, component: SupportUsComponent },
      { path: 'about-project', data: { title: 'Оренда нерухомості, квартир, розмістити оголошення, пошук орендарів. Головна сторінка - Discussio™', description: 'Ось де ви знайдете нерухомість для оренди. А також орендарів для заселення.' }, component: AboutProjectComponent },
      { path: 'opportunities', component: HomePageComponent },
      { path: 'our-team', data: { title: 'Наша команда по розробці Discussio™ оренда житла, та розміщення оголошень.', description: 'Люди які розробляють платформу діскусіо. Роблять оренду доступною комфортною та зрозумілою для всіх!' }, component: OurTeamComponent },
      { path: 'user-licence', data: { title: 'Угода користувача. Створити угоду оренди. Створити акт прийому-передачі оселі', description: 'Створюйте перевіряйте та приймайте угоди які вам надсилають' }, component: UserLicenceComponent, },
      { path: 'update', data: { title: 'Наші останні оновлення на нашій платформі для нерухомості Discussio.', description: 'Ми ділимось з вами нашим розвитком та становленням! Підтримайте наш проект та підписуйтесь на наші оновлення!' }, component: UpdateInfoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
