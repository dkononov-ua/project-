import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-project',
  templateUrl: './about-project.component.html',
  styleUrls: ['./about-project.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(200%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(200%)', opacity: 0 }))
      ]),
    ]),

    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1200ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition('* => void', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('1200ms ease-in-out', style({ transform: 'scale(0.5)', opacity: 0 }))
      ]),
    ]),
  ],
})
export class AboutProjectComponent {

  currentStep: number = 0;
  currentScenario: number = 1;
  statusMessage: string | undefined;

  changeStep(step: number): void {
    this.currentStep = step;
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
