import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../interface/animation';
import { Location } from '@angular/common';

interface Option {
  label: string;
  icon: string;
}
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.top1,
    animations.right2,
    animations.swichCard,
  ],
})
export class FeedbackComponent implements OnInit {

  statusMessage: string | undefined;
  path_logo = path_logo;
  evaluations: any;
  optionDevice: string = '';
  menuName: any;
  optionComfort: string = '';
  optionDesign: string = '';
  optionImpression: string = '';
  menuComment: string = '';
  optionRating: string = '';
  optionFunctional: string = '';
  optionName: Option[] = [
    { label: 'Чат', icon: 'fa-solid fa-message' },
    { label: 'Підписки', icon: 'fa-solid fa-people-pulling' },
    { label: 'Підписники', icon: 'fa-solid fa-child-reaching' },
    { label: 'Дискусії', icon: 'fa-solid fa-person-walking-luggage' },
    { label: 'Статистика', icon: 'fa-solid fa-chart-pie' },
    { label: 'Налаштування оселі', icon: 'fa-solid fa-gear' },
    { label: 'Налаштування користувача', icon: 'fa-solid fa-user-gear' },
    { label: 'Пошук оселі', icon: 'fa-solid fa-magnifying-glass' },
    { label: 'Пошук орендаря', icon: 'fa-solid fa-person-circle-plus' },
    { label: 'Угоди', icon: 'fa-solid fa-handshake-angle' },
    { label: 'Акт прийому-передачі', icon: 'fa-solid fa-file-contract' },
    { label: 'Мешканці', icon: 'fa-solid fa-people-roof' },
    { label: 'Наповнення', icon: 'fa-solid fa-boxes-packing' },
    { label: 'Пріорітетні категорії', icon: 'fa-solid fa-restroom' },
    { label: 'Профіль користувача', icon: 'fa-regular fa-circle-user' },
    { label: 'Профіль оселі', icon: 'fa-solid fa-person-shelter' },
    { label: 'Профіль орендаря', icon: 'fa-solid fa-person-hiking' },
    { label: 'Керування оселею', icon: 'fa-solid fa-house-circle-check' },
    { label: 'Пропоную', icon: 'fa-solid fa-puzzle-piece' },
  ]
  category: any;
  isMobile: boolean = false;
  indexPage: number = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private location: Location,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      const selectedCategory = this.optionName!.find(option => option.label === this.category);
      this.menuName = selectedCategory;
      if (this.menuName) {
        this.getFeedback()
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  async saveFeedback(): Promise<void> {
    console.log(this.menuName.label)
    const userJson = localStorage.getItem('user');
    const formData = {
      menuComment: this.menuComment || '',
      menuName: this.menuName.label,
      optionComfort: this.optionComfort || '',
      optionDesign: this.optionDesign || '',
      optionDevice: this.optionDevice || '1',
      optionFunctional: this.optionFunctional || '',
      optionImpression: this.optionImpression || '',
    };
    console.log(formData)
    if (userJson && this.menuName) {
      try {
        const response: any = await this.http.post(serverPath + '/feedback/add', {
          auth: JSON.parse(userJson),
          user_id: JSON.parse(userJson).user_id,
          formData
        }).toPromise();
        if (response) {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Дякуємо за ваш відгук');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 1500);
          }, 500);
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 1500);
          }, 500);
        }
      }
      catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not found');
    }
  }

  clearForm() {
    this.optionComfort = '50';
    this.optionDesign = '50';
    this.optionImpression = '50';
    this.menuComment = '';
    this.optionRating = '50';
    this.optionFunctional = '50';
    this.optionDevice = '1';
  }

  async getFeedback() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response = await this.http.post(serverPath + '/feedback/get/user', {
          auth: JSON.parse(userJson),
          menuName: this.menuName.label,
        }).toPromise();
        if (Array.isArray(response) && response.length > 0) {
          this.evaluations = response[0];
          this.optionComfort = this.evaluations.optionComfort.toString();
          this.optionDesign = this.evaluations.optionDesign.toString();
          this.optionImpression = this.evaluations.optionImpression.toString();
          this.menuComment = this.evaluations.menuComment;
          this.optionRating = this.evaluations.optionRating;
          this.optionFunctional = this.evaluations.optionFunctional.toString();
          this.optionDevice = this.evaluations.optionDevice;
        } else {
          this.clearForm();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }
}
