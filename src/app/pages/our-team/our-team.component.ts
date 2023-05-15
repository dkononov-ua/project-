import { Component } from '@angular/core';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.scss']
})
export class OurTeamComponent {

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
