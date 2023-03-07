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
      position: 'CEO',
      description: 'Автор ідеї. Зараз активно працює над створенням нового соціального сервісу для нерухомості.',
      image: '../../assets/photo1.png',
      social: {
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.twitter.com',
        linkedin: 'https://www.linkedin.com'
      }
    },
    {
      name: 'Maksym Oliinyk',
      position: 'CTO',
      description: 'Максим має великий досвід у створенні високоякісного програмного забезпечення та знає всі сучасні технології та інструменти для розробки додатків.',
      image: '../../assets/photo2.jpg',
      social: {
        instagram: 'https://instagram.com/maks._.oleynik?igshid=NTE5MzUyOTU=',
        twitter: 'https://twitter.com/MaksimOliynik',
        linkedin: 'https://www.linkedin.com/in/maksim-oliinyk-b0a9ab210/'
      }
    }
  ]
}
