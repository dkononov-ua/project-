import { trigger, transition, style, animate } from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { path_logo } from 'src/app/config/server-config';
import { animations } from '../../interface/animation';
import { ViewportScroller } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { AuthGoogleService } from 'src/app/auth/auth-google.service';

@Component({
  selector: 'app-about-project',
  templateUrl: './about-project.component.html',
  styleUrls: ['./about-project.component.scss'],
  animations: [
    animations.bot,
    animations.bot3,
    animations.top,
    animations.top1,
    animations.top2,
    animations.top4,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,

  ],
})
export class AboutProjectComponent implements OnInit {
  path_logo = path_logo;
  currentStep: number = 0;
  currentScenario: number = 1;
  statusMessage: string | undefined;
  gmail: string = 'discussio.inc@gmail.com';

  containers: { [key: string]: boolean } = {
    container1: false,
    container2: false,
    container3: false,
    container4: false
  };

  scrollToAnchor(anchor: string): void {
    // Встановлюємо статус активності для вибраного контейнера
    this.containers[anchor] = true;

    setTimeout(() => {
      const element = this.el.nativeElement.querySelector(`#${anchor}`);
      if (element) {
        const container = element.parentElement;
        const scrollTop = element.offsetTop - container.offsetTop; // Відстань від верху контейнера до елемента
        container.scrollTop = scrollTop;
      }
    }, 30);
  }


  constructor(
    private el: ElementRef,
    private viewportScroller: ViewportScroller,
    private sharedService: SharedService,
    private authGoogleService: AuthGoogleService,
  ) { }

  ngOnInit() {
  }

  changeStep(step: number): void {
    this.currentStep = step;
  }

  openGoogleAuth() {
    this.authGoogleService.singAuthGoogle('login');
  }

  logout() {
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    this.sharedService.setStatusMessage('Дані кукі та кешу очищені');
    setTimeout(() => {
      this.sharedService.setStatusMessage('');
      location.reload();
    }, 1500);
  }

  changeScenario(step: number): void {
    this.currentScenario = step;
  }

  teamMembers = [
    {
      name: 'Denys Kononov',
      position: 'Frontend',
      description: 'Автор ідеї Discussio. Активно працює над створенням нового соціального сервісу для нерухомості. Відкритий до спілкування та готовий ділитися своїм досвідом з колегами та друзями.',
      image: '../../assets/photo1.jpg',
      social: {
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.twitter.com',
        linkedin: 'https://www.linkedin.com'
      }
    },
    {
      name: 'Maksym Oliinyk',
      position: 'Frontend',
      description: 'Максим має великий досвід у створенні високоякісного програмного забезпечення та знає всі сучасні технології та інструменти для розробки додатків.',
      image: '../../assets/photo2.jpg',
      social: {
        instagram: 'https://instagram.com/maks._.oleynik?igshid=NTE5MzUyOTU=',
        twitter: 'https://twitter.com/MaksimOliynik',
        linkedin: 'https://www.linkedin.com/in/maksim-oliinyk-b0a9ab210/'
      }
    },
    {
      name: 'Viktor Yakovets',
      position: 'Backend',
      description: 'За свою кар`єру Віктор взяв участь у розробці багатьох успішних проектів та отримав високі оцінки за свою роботу.Він є відповідальним та професійним спеціалістом, який завжди дотримується найвищих стандартів у своїй роботі та надає велику увагу деталям.',
      image: '../../assets/photo5.jpg',
      social: {
        instagram: '',
        twitter: '',
        linkedin: ''
      }
    }

  ]
}
