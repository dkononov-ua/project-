import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.scss'],
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
  ],
})
export class OurTeamComponent {

  currentStep: number = 4;
  statusMessage: string | undefined;

  changeStep(step: number): void {
    this.currentStep = step;
  }

  teamMembers = [
    {
      name: 'Denys Kononov',
      position: 'CEO, Frontend, Design',
      description: 'Автор ідеї Discussio. Активно працює над створенням нового соціального сервісу для нерухомості. Відкритий до спілкування та готовий ділитися своїм досвідом з колегами та друзями.',
      image: '../../../assets/developers/photo1.jpg',
      social: {
        telegram: 'https://t.me/DenisKononov',
        instagram: 'https://www.instagram.com/kononov.den1s/',
        twitter: 'https://www.twitter.com',
        linkedin: 'https://www.linkedin.com/in/denys-kononov-371625261/'
      }
    },
    // {
    //   name: 'Maksym Oliinyk',
    //   position: 'Frontend',
    //   description: 'Максим має великий досвід у створенні високоякісного програмного забезпечення та знає всі сучасні технології та інструменти для розробки додатків.',
    //   image: '../../../assets/developers/photo2.jpg',
    //   social: {
    //     instagram: 'https://instagram.com/maks._.oleynik?igshid=NTE5MzUyOTU=',
    //     twitter: 'https://twitter.com/MaksimOliynik',
    //     linkedin: 'https://www.linkedin.com/in/maksim-oliinyk-b0a9ab210/'
    //   }
    // },
    {
      name: 'Viktor Yakovets',
      position: 'Backend, DevOps',
      description: 'За свою кар`єру Віктор взяв участь у розробці багатьох успішних проектів та отримав високі оцінки за свою роботу.Він є відповідальним та професійним спеціалістом, який завжди дотримується найвищих стандартів у своїй роботі та надає велику увагу деталям.',
      image: '../../../assets/developers/photo5.jpg',
      social: {
        instagram: '',
        twitter: '',
        linkedin: ''
      }
    }

  ]
}
