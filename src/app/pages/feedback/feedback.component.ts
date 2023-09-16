import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

export class Feedback {
  constructor(
    public optionName: string = '',
    public optionComfort: string = '',
    public optionDesign: string = '',
    public optionImpression: string = '',
    public optionComment: string = '',
    public optionRating: string = '',
    public optionFunctional: string = ''
  ) { }
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {

  @ViewChild('feedbackForm') feedbackForm!: NgForm;

  ratings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  menu: Feedback = new Feedback();
  subscriptions: Feedback = new Feedback();
  discussion: Feedback = new Feedback();
  settings: Feedback = new Feedback();
  communal: Feedback = new Feedback();
  housingSearch: Feedback = new Feedback();
  tenantSearch: Feedback = new Feedback();
  agreements: Feedback = new Feedback();
  filling: Feedback = new Feedback();
  residents: Feedback = new Feedback();

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

  optionDevice: number = 0;
  submitFeedback() {
    if (this.feedbackForm.valid) {
      const formData = this.feedbackForm.value;
      console.log(formData)
    }
  }

}
