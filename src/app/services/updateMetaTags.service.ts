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
    // console.log(data);

    const defaultTitle = 'Discussio соціальна платформа для нерухомості';
    const defaultDescription = 'Діскусіо - платформа для пошуку та оренди перевірених осель. Розміщення оголошень про здачу в оренду осель та оголошень про пошук житла. Керування нерухомістю, створення автоматичних угод оренди. Ми створюємо спільноту орендодавців та орендарів, приєднуйтесь!.';
    const defaultImage = 'https://discussio.site/assets/logo/discussio.png';  // Шлях до зображення за замовчуванням
    const defaultUrl = window.location.href;
    const defaultOgType = 'website';
    const defaultTwitterCard = 'summary_large_image';
    const defaultAuthor = 'Discussio Team';
    const defaultRobots = 'index, follow';


    const defaultCanonical = defaultUrl;
    const defaultThemeColor = '#FF7D66';  // Колір за замовчуванням

    const title = data.title || defaultTitle;
    const description = data.description || defaultDescription;
    const image = data.image || defaultImage;
    const url = data.url || defaultUrl;
    const ogType = data.ogType || defaultOgType;
    const twitterCard = data.twitterCard || defaultTwitterCard;
    const author = data.author || defaultAuthor;
    const robots = data.robots || defaultRobots;
    const canonical = data.canonical || defaultCanonical;
    const themeColor = data.themeColor || defaultThemeColor;

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: data.keywords });

    // Оновлення заголовків Open Graph
    this.updateMetaTag('property', 'og:title', title);
    this.updateMetaTag('property', 'og:description', description);
    this.updateMetaTag('property', 'og:image', image);
    this.updateMetaTag('property', 'og:url', url);
    this.updateMetaTag('property', 'og:type', ogType);

    // Оновлення заголовків Twitter Card
    this.updateMetaTag('name', 'twitter:card', twitterCard);
    this.updateMetaTag('name', 'twitter:title', title);
    this.updateMetaTag('name', 'twitter:description', description);
    this.updateMetaTag('name', 'twitter:image', image);

    // Оновлення додаткових мета-тегів
    this.updateMetaTag('name', 'author', author);
    this.updateMetaTag('name', 'robots', robots);
    this.updateMetaTag('name', 'canonical', canonical);
    this.updateMetaTag('name', 'theme-color', themeColor);
  }

  private updateMetaTag(attribute: string, name: string, content: string): void {
    this.metaService.updateTag({ [attribute]: name, content });
  }


  // updateMetaTags(data: any): void {
  //   // console.log(data.image)
  //   console.log(data)
  //   this.titleService.setTitle(data.title);
  //   this.metaService.updateTag({ name: 'description', content: data.description });
  //   this.metaService.updateTag({ name: 'keywords', content: data.keywords });
  //   // Оновлення заголовків Open Graph
  //   this.metaService.updateTag({ property: 'og:title', content: data.title || 'Discussio соціальна платформа для нерухомості' });
  //   this.metaService.updateTag({ property: 'og:description', content: data.description || 'Діскусіо - платформа для пошуку та оренди перевірених осель. Розміщення оголошень про здачу в оренду осель та оголощень про пошук житла. Керування нерухомістю, створення автоматичних угод оренди. Ми створюємо спільноту орендодавців та орендарів, приєднуйтесь!.' });
  //   this.metaService.updateTag({ property: 'og:image', content: data.image || 'assets/logo/discussio.png' });
  //   this.metaService.updateTag({ property: 'og:url', content: data.url });
  //   this.metaService.updateTag({ property: 'og:type', content: data.ogType || 'website' });
  //   // Оновлення заголовків Twitter Card
  //   this.metaService.updateTag({ name: 'twitter:card', content: data.twitterCard || 'summary_large_image' });
  //   this.metaService.updateTag({ name: 'twitter:title', content: data.title || 'Discussio соціальна платформа для нерухомості' });
  //   this.metaService.updateTag({ name: 'twitter:description', content: data.description || 'Діскусіо - платформа для пошуку та оренди перевірених осель. Розміщення оголошень про здачу в оренду осель та оголощень про пошук житла. Керування нерухомістю, створення автоматичних угод оренди. Ми створюємо спільноту орендодавців та орендарів, приєднуйтесь!.' });
  //   this.metaService.updateTag({ name: 'twitter:image', content: data.image || 'assets/logo/discussio.png' });
  // }
}

