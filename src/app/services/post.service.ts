import { Injectable } from '@angular/core';
import { FirebaseDataService } from '../config/firebaseData.service';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: any[] = [];
  selectedPostID: string = '';

  constructor(private firebaseDataService: FirebaseDataService) { }

  async getPosts(): Promise<any> {
    try {
      const response: any = await this.firebaseDataService.fetchData('posts');
      if (response) {
        this.posts = Object.keys(response).map(key => ({ id: key, ...response[key] }));
        this.posts = this.posts.map(post => ({
          ...post,
          formattedDate: this.formatTimestamp(post.time),
          slug: this.generateSlug(post.title)
        }));
        this.posts = [...this.posts].reverse();
      } else {
        this.posts = [];
      }
      return this.posts;
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  getPostBySlug(slug: string | null): any {
    if (slug === null) {
      return null;
    } if (slug && this.posts) {
      return this.posts.find(post => post.slug === slug);
    }
  }

  generateSlug(title: string): string {
    return this.transliterate(title).toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  transliterate(text: string): string {
    const cyrillicToLatinMap: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh',
      'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
      'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'Ye', 'Ж': 'Zh',
      'З': 'Z', 'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
      'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
      'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return text.split('').map(char => cyrillicToLatinMap[char] || char).join('');
  }

  formatTimestamp(time: number): string {
    return formatDate(new Date(time), 'dd MMM yyyy, HH:mm:ss', 'uk-UA');
  }
}
