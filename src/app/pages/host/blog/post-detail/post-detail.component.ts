import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { animations } from '../../../../interface/animation';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
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
export class PostDetailComponent implements OnInit {

  post: any;
  slug: any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private updateMetaTagsService: UpdateMetaTagsService,
    private sanitizer: DomSanitizer,
    private router: Router, // Додаємо Router для генерації посилань
  ) { }

  async ngOnInit(): Promise<void> {
    await this.postService.getPosts();
    this.slug = this.route.snapshot.paramMap.get('title');
    this.post = await this.postService.getPostBySlug(this.slug);

    // Видаляємо теги з заголовку
    this.post.title = this.stripHtmlTags(this.post.title);

    // Видаляємо теги з контенту перед обрізанням
    const cleanedContent = this.stripHtmlTags(this.post.content);

    this.updateMetaTagsInService(cleanedContent);
  }

  // Очищення тексту від HTML-тегів
  private stripHtmlTags(text: string): string {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  }

  // Оновлюю метатеги в залежності від локації з конфігу data/page-config
  private updateMetaTagsInService(cleanedContent: string): void {
    const data = {
      title: this.post.title,
      description: this.truncateText(cleanedContent, 170), // Використовуємо очищений контент
      keywords: this.post.keywords || this.post.title,
      image: this.post.image,
      canonical: 'https://discussio.site/' + this.post.slug,
      url: 'https://discussio.site/' + this.post.slug,
    }
    this.updateMetaTagsService.updateMetaTags(data);
  }

  private truncateText(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  sanitizeContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  shareLink(postId: string) {
    const link = this.router.createUrlTree(['/blog', postId]).toString();
    const fullLink = `${window.location.origin}${link}`;
    const title = this.post.title;
    if (navigator.share && title) {
      navigator.share({
        title: title,
        text: 'Детальніше за посиланням:',
        url: fullLink,
      })
        .then(() => console.log('Successfully shared'))
        .catch(error => console.error('Error sharing:', error));
    } else {
      console.error('Web Share API is not supported in this browser.');
    }
  }

}
