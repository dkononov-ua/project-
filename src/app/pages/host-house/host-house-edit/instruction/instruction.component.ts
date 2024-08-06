import { Component } from '@angular/core';
import { animations } from '../../../../interface/animation';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedService } from 'src/app/services/shared.service';
import * as ServerConfig from 'src/app/config/path-config';
@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.right,
    animations.right1,
    animations.right2,
    animations.right3,
    animations.right4,
    animations.swichCard,
  ],

})
export class InstructionComponent {
  constructor(
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
  ) { }
}
