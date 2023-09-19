import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
export class Feedback {
  constructor(
    public optionDevice: string = '',
    public menuName: string = '',
    public optionComfort: string = '',
    public optionDesign: string = '',
    public optionImpression: string = '',
    public menuComment: string = '',
    public optionRating: string = '',
    public optionFunctional: string = ''
  ) { }
}
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {

  @ViewChild('feedbackForm') feedbackForm!: NgForm;
  menu: Feedback = new Feedback();
  menuName: string | undefined;

  optionName = [
    'Чат',
    'Підписки',
    'Дискусія',
    'Налаштування',
    'Комуналка',
    'Пошук оселі',
    'Пошук орендара',
    'Угоди',
    'Наповнення',
    'Мешканці',
  ]

  optionComfort = [
    'Не зручно',
    'Скоріше не зручно',
    'Скоріше зручно',
    'Зручно',
  ]

  optionDesign = [
    'Погано',
    'Нормально',
    'Добре',
    'Гарно',
  ]

  optionImpression = [
    'Переробити повністью',
    'Підправити трошки',
    'Все ок',
  ]

  optionFunctional = [
    'Мало, треба додати ще',
    'Все що треба є',
    'Багато непотрібного',
  ]

  constructor(
    private http: HttpClient) { }

  ngOnInit(): void {
  }

  async saveFeedback(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const formData = this.feedbackForm.value;
    if (userJson && this.feedbackForm.valid) {
      try {
        const response = await this.http.post('http://localhost:3000/feedback/add', {
          auth: JSON.parse(userJson),
          user_id: JSON.parse(userJson).user_id,
          formData
        }).toPromise();
        console.log(response)
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not found');
    }
  }

  clearForm() {
    this.menu.optionComfort = '';
    this.menu.optionDesign = '';
    this.menu.optionImpression = '';
    this.menu.menuComment = '';
    this.menu.optionRating = '';
    this.menu.optionFunctional = '';
    this.menu.optionDevice = '';
  }

  async getFeedback() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response = await this.http.post('http://localhost:3000/feedback/get/user', {
          auth: JSON.parse(userJson),
          menuName: this.menu.menuName,
        }).toPromise();

        if (Array.isArray(response) && response.length > 0) {
          this.menu = response[0];
          console.log(this.menu);
        } else {
          console.log('Меню з такою назвою не знайдено');
          this.clearForm();
        }
      } catch (error) {
        this.menu = new Feedback();
        console.error(error);
      }
    } else {
      console.log('user not found');
    }
  }
}
