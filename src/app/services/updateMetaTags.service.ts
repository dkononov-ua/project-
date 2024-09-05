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
    const defaultTitle = 'Discussio соціальна платформа для нерухомості';
    const defaultDescription = 'Діскусіо - платформа для пошуку та оренди перевірених осель. Розміщення оголошень про здачу в оренду осель та оголошень про пошук житла. Керування нерухомістю, створення автоматичних угод оренди. Ми створюємо спільноту орендодавців та орендарів, приєднуйтесь!.';
    const defaultImage = 'https://discussio.site/assets/logo/discussio.png';
    const defaultUrl = 'https://discussio.site/';
    const defaultOgType = 'website';
    const defaultTwitterCard = 'summary_large_image';
    const defaultAuthor = 'Discussio Team';
    const defaultRobots = 'index, follow';
    const defaultCanonical = defaultUrl;
    const defaultThemeColor = '#FFFFFF';
    // console.log(data)
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

    // Оновлення заголовка
    this.titleService.setTitle(title);

    // Оновлення мета-тегів
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: data.keywords || '' });

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

    // Оновлення канонічного URL
    this.updateLinkTag('canonical', canonical);

    // Оновлення кольору теми
    this.updateMetaTag('name', 'theme-color', themeColor);
  }

  private updateMetaTag(attribute: string, name: string, content: string): void {
    const tag = document.querySelector(`meta[${attribute}="${name}"]`);

    if (tag) {
      tag.setAttribute('content', content);
    } else {
      const newTag = document.createElement('meta');
      newTag.setAttribute(attribute, name);
      newTag.setAttribute('content', content);
      document.head.appendChild(newTag);
    }
  }

  private updateLinkTag(rel: string, href: string): void {
    let link: HTMLLinkElement = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

    if (link) {
      link.setAttribute('href', href);
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    }
  }




}

