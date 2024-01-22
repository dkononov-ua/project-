import { Component } from '@angular/core';
import { animations } from '../../../interface/animation';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss'],
  animations: [
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],

})
export class InstructionComponent {

}
