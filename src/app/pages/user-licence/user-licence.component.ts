import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Location } from '@angular/common';
import { animations } from '../../interface/animation';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

@Component({
  selector: 'app-user-licence',
  templateUrl: './user-licence.component.html',
  styleUrls: ['./user-licence.component.scss'],
  animations: [
    animations.bot,
    animations.bot3,
    animations.top,
    animations.top1,
    animations.top2,
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



export class UserLicenceComponent {
  goBack(): void {
    this.location.back();
  }

  constructor(
    private location: Location,
    private sharedService: SharedService,
    private updateMetaTagsService: UpdateMetaTagsService,
  ) {  }

  ngOnInit() {
    this.updateMetaTagsInService();
  }

  private updateMetaTagsInService(): void {
    const data = {
      title: 'Угода користувача. Створити угоду оренди. Створити акт прийому-передачі оселі',
      description: 'Створюйте перевіряйте та приймайте угоди які вам надсилають',
      keywords: 'угода, оренда, акт прийому-передачі, угода користувача',
      image: '',
    }
    this.updateMetaTagsService.updateMetaTags(data)
  }

}
