import { Component, OnInit } from '@angular/core';
import { path_logo } from 'src/app/config/server-config';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0%)'}))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0%)'}),
        animate('500ms ease-in-out', style({ transform: 'translateX(-100%)'}))
      ]),
    ]),
  ],
})

export class TransitionComponent implements OnInit {
  ngOnInit(): void {
    setTimeout(() => {
      this.loading2 = false;
    }, 500);
  }
  loading2 = true;
  path_logo = path_logo;
}
