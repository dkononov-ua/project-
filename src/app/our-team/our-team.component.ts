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
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend elit eu urna tristique, ut bibendum eros auctor.',
      image: './assets/images/team-member-1.jpg',
      social: {
        instagram: 'https://www.facebook.com',
        twitter: 'https://www.twitter.com',
        linkedin: 'https://www.linkedin.com'
      }
    },
    {
      name: 'Maksym Oliinyk',
      position: 'CTO',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend elit eu urna tristique, ut bibendum eros auctor.',
      image: './assets/images/team-member-1.jpg',
      social: {
        instagram: 'https://instagram.com/maks._.oleynik?igshid=NTE5MzUyOTU=',
        twitter: 'https://twitter.com/MaksimOliynik',
        linkedin: 'https://www.linkedin.com/in/maksim-oliinyk-b0a9ab210/'
      }
    }
  ]
}
