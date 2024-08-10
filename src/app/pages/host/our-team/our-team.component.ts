import { Component, ElementRef } from '@angular/core';
import { animations } from '../../../interface/animation';
import * as ServerConfig from 'src/app/config/path-config';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.scss'],
  animations: [
    animations.bot,
    animations.bot3,
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.bot5,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.appearance,
  ],
})
export class OurTeamComponent {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  currentStep: number = 4;
  statusMessage: string | undefined;

  changeStep(step: number): void {
    this.currentStep = step;
  }

  technologies = [
    {
      name: 'Angular',
      image: '../../../assets/technologies/angular.png',
    },
    {
      name: 'JavaScript',
      image: '../../../assets/technologies/js.png',
    },
    {
      name: 'TypeScript',
      image: '../../../assets/technologies/ts.png',
    },
    {
      name: 'Firebase',
      image: '../../../assets/technologies/firebase.svg',
    },
    {
      name: 'Docker',
      image: '../../../assets/technologies/docker.svg',
    },
    {
      name: 'Nest JS',
      image: '../../../assets/technologies/nest.png',
    },
    {
      name: 'SQL',
      image: '../../../assets/technologies/sql.svg',
    },
    {
      name: 'Node JS',
      image: '../../../assets/technologies/node.png',
    },
    {
      name: 'Github',
      image: '../../../assets/technologies/github.png',
    },
    {
      name: 'Canva',
      image: '../../../assets/technologies/canva.png',
    },
    {
      name: 'Scss',
      image: '../../../assets/technologies/scss.svg',
    },
    {
      name: 'Css',
      image: '../../../assets/technologies/css.png',
    },
    {
      name: 'Html',
      image: '../../../assets/technologies/html.svg',
    },
  ]

  teamMembers = [
    {
      name: 'Denys Kononov',
      position: 'CEO, Frontend, UX/UI',
      description: 'Автор та засновник Discussio. Активно працює над створенням нового соціального сервісу для нерухомості. Завжди відкритий до спілкування і готовий ділитися своїм багатим досвідом з колегами та друзями, сприяючи розвитку команди та підвищенню якості сервісу.',
      image: '../../../assets/developers/photo2.jpg',
      social: {
        telegram: 'https://t.me/DenisKononov',
        instagram: 'https://www.instagram.com/kononov.den1s/',
        twitter: 'https://www.twitter.com',
        linkedin: 'https://www.linkedin.com/in/denys-kononov-371625261/'
      }
    },
    {
      name: 'Viktor Yakovets',
      position: 'Backend, DevOps',
      description: 'Viktor є відповідальним та професійним спеціалістом з багатим досвідом у розробці та впровадженні backend-рішень. Разом з Denys Kononov вони почали робити проект Discussio з самого початку, втілюючи в життя новий соціальний сервіс для нерухомості. Viktor завжди дотримується найвищих стандартів у своїй роботі та надає велику увагу деталям.',
      image: '../../../assets/developers/photo5.jpg',
      social: {
        telegram: 'https://t.me/Viktor194638',
        twitter: '',
        linkedin: 'https://www.linkedin.com/in/%D0%B2%D1%96%D0%BA%D1%82%D0%BE%D1%80-%D1%8F%D0%BA%D0%BE%D0%B2%D0%B5%D1%86%D1%8C-725489243/'
      }
    },
    {
      name: 'Pavlo Syrykh',
      position: 'Mentor, DevOps, Senior C++ Software Engineer',
      description: "Pavlo Syrykh - досвідчений фахівець з розробки програмних продуктів із більш ніж 4-річним досвідом роботи. Має міцну освіту в галузі комп'ютерних наук та електроніки. Комунікабельний і командний гравець. Ініціативний та самовмотивований професіонал, який прагне досягати високих результатів у своїй роботі.",
      image: '../../../assets/developers/photo4.jpg',
      social: {
        telegram: 'https://t.me/psyrykh',
        twitter: '',
        linkedin: 'https://www.linkedin.com/in/psyrykh/'
      }
    },
    {
      name: 'Svitlana Loietska',
      position: 'Lawyer, Business Development Manager',
      description: 'Svitlana професіонал у сфері бізнес-розвитку та правового консультування. Завдяки її багаторічному досвіду, Svitlana успішно координує зустрічі з інвесторами, ефективно представляє компанію на ринку та сприяє залученню фінансування для розвитку бізнесу. Вона також має навички розробки стратегій розвитку, що допомагає компанії досягати поставлених цілей.',
      image: '../../../assets/developers/photo3.jpg',
      social: {
        telegram: 'https://t.me/sloyetskaya',
        twitter: '',
        linkedin: 'https://www.linkedin.com/in/svitlana-loietska-5a9937237/'
      }
    },
    {
      name: 'Volodymyr Sova',
      position: 'Marketing Director, Brand management',
      description: 'Відповідальний за управління та розвиток бренду компанії. Volodymyr – досвідчений маркетолог та таргетолог, який спеціалізується на створенні і реалізації ефективних маркетингових стратегій. Він має глибоке розуміння ринку та споживачів, що дозволяє йому точно визначати цільову аудиторію і розробляти кампанії, які забезпечують максимальний результат. ',
      image: '../../../assets/developers/photo6.jpg',
      social: {
        telegram: 'https://t.me/sovaWeb',
        instagram: '',
        twitter: '',
        linkedin: ''
      }
    }

  ]

  scrollToAnchor(anchor: number): void {
    setTimeout(() => {
      const element = this.el.nativeElement.querySelector(`#conteiner${anchor}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }

  constructor(
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.scrollToAnchor(0);
  }
}
