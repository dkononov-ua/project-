import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from 'src/app/interface/animation';
import { faq } from 'src/app/data/faq-data';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [
    animations.bot,
    animations.bot3,
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
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
export class FaqComponent implements OnInit {

  searchTerm: string = '';

  // Масив з усіма питаннями
  faq = faq;
  filteredFaq = this.faq;
  uniqueCategories: string[];
  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  selectedCategory: string = '';

  constructor(
    private sharedService: SharedService,
  ) {
    this.uniqueCategories = Array.from(new Set(this.faq.map(item => item.category)));
  }

  ngOnInit(): void {
    this.getCheckDevice();
  }

  // Фільтрація по категорії
  filterFaqCategory(category: string) {
    if (category === '') {
      this.filteredFaq = faq;
    } else {
      this.selectedCategory = category;
      this.filteredFaq = category === null
        ? this.faq
        : this.faq.filter(item => item.category === category);
    }
  }

  isNewlyUpdated(lastUpdated: string): boolean {
    const today = new Date();
    const lastUpdatedDate = new Date(lastUpdated);
    const differenceInTime = today.getTime() - lastUpdatedDate.getTime();
    const daysDifference = differenceInTime / (1000 * 3600 * 24);
    return daysDifference <= 7;
  }

  // Викликається при зміні тексту пошуку
  onSearchChange() { }

  // Перевірка на пристрій
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

}
