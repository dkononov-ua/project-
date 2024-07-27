import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UpdateMetaTagsService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) { }

  updateMetaTags(data: any): void {
    // console.log(data.image)
    // console.log(data.url)
    this.titleService.setTitle(data.title);
    this.metaService.updateTag({ name: 'description', content: data.description });
    this.metaService.updateTag({ name: 'keywords', content: data.keywords });
    // Оновлення заголовків Open Graph
    this.metaService.updateTag({ property: 'og:title', content: data.title || 'Discussio соціальна платформа для нерухомості' });
    this.metaService.updateTag({ property: 'og:description', content: data.description || 'Діскусіо - платформа для пошуку та оренди перевірених осель. Розміщення оголошень про здачу в оренду осель та оголощень про пошук житла. Керування нерухомістю, створення автоматичних угод оренди. Ми створюємо спільноту орендодавців та орендарів, приєднуйтесь!.' });
    this.metaService.updateTag({ property: 'og:image', content: data.image || 'assets/logo/discussio.png' });
    this.metaService.updateTag({ property: 'og:url', content: data.url || 'https://discussio.site' });
    this.metaService.updateTag({ property: 'og:type', content: data.ogType || 'website' });
    // Оновлення заголовків Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: data.twitterCard || 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: data.title || 'Discussio соціальна платформа для нерухомості' });
    this.metaService.updateTag({ name: 'twitter:description', content: data.description || 'Діскусіо - платформа для пошуку та оренди перевірених осель. Розміщення оголошень про здачу в оренду осель та оголощень про пошук житла. Керування нерухомістю, створення автоматичних угод оренди. Ми створюємо спільноту орендодавців та орендарів, приєднуйтесь!.' });
    this.metaService.updateTag({ name: 'twitter:image', content: data.image || 'assets/logo/discussio.png' });
  }
}

