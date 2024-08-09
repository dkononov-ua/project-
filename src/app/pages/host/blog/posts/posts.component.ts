import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDataService } from 'src/app/config/firebaseData.service';
import { formatDate } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { animations } from '../../../../interface/animation';
import { Meta, Title } from '@angular/platform-browser';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
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
export class PostsComponent implements OnInit {

  close() {
    this.selectedPost = false;
    this.selectedPostID = '';
  }
  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  posts: any[] = [];
  postForm: FormGroup;
  selectedPostID: string = '';
  selectedPost: boolean = false;
  maxLength: number = 800;

  categories = [
    'Новини',
    'Оновлення',
    'Реклама',
    'Поради',
  ]

  openStatus: boolean = false;
  toogleOpenStatus() {
    this.openStatus = !this.openStatus;
  }

  filteredPosts: any[] = [];
  selectedCategory: number | null = null;
  selectedPerson: number | null = null;

  constructor(
    private fb: FormBuilder,
    private firebaseDataService: FirebaseDataService,
    private sharedService: SharedService,
    private router: Router,
    private updateMetaTagsService: UpdateMetaTagsService,
    private postService: PostService,
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      content: ['', Validators.required],
      image: [''],
      link: [''],
    });
  }

  ngOnInit(): void {
    this.getCheckDevice();
    this.updateMetaTagsInService();
    this.loadPosts();
  }

  private updateMetaTagsInService(): void {
    const data = {
      title: 'Блог про оренду нерухомості та запуск нових функцій Discussio.',
      description: 'Ми ділимось з вами нашим розвитком та становленням! Підтримайте наш проект та підписуйтесь на наші оновлення!',
      keywords: 'блог, оренда нерухомості, новини, Discussio',
      image: '/assets/blog/blog.png',
      url: 'https://discussio.site/blog',
    }
    this.updateMetaTagsService.updateMetaTags(data)
  }

  // Перевірка на пристрій
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  selectPost(post: any) {
    // console.log(post)
    this.selectedPost = true;
    this.selectedPostID = post.id;
  }

  async loadPosts() {
    const posts = await this.postService.getPosts();
    if (posts) {
      this.posts = posts;
      this.filteredPosts = posts; // Ініціалізація відфільтрованих постів
    }
  }

  filterPostsCategory(category: number | null, person: number | null) {
    this.selectedCategory = category;
    this.selectedPerson = person;

    this.filteredPosts = this.posts;

    if (category !== null) {
      this.filteredPosts = this.filteredPosts.filter(post => post.categories === category);
    }

    if (person !== null) {
      this.filteredPosts = this.filteredPosts.filter(post => post.person === person);
    }
  }

  formatTimestamp(time: number): string {
    return formatDate(new Date(time), 'dd MMM yyyy, HH:mm:ss', 'uk-UA');
  }

  // Перехід до оселі
  goToHouse() {
    if (this.authorizationHouse) {
      setTimeout(() => {
        this.router.navigate(['/house']);
      }, 100);
    } else {
      this.sharedService.setStatusMessage('Переходимо до вибору оселі');
      setTimeout(() => {
        this.router.navigate(['/house/house-control/selection-house']);
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }
}
