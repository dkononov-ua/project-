import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDataService } from 'src/app/config/firebaseData.service';
import { formatDate } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {

  close() {
    console.log(11111111)
    this.selectedPostID = '';
  }
  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  posts: any[] = [];
  postForm: FormGroup;
  selectedPostID: string = '';
  constructor(
    private fb: FormBuilder,
    private firebaseDataService: FirebaseDataService,
    private sharedService: SharedService,
    private router: Router,

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
    this.loadPosts();
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
    console.log(post)
    this.selectedPostID = post.id;
  }

  async loadPosts() {
    try {
      const response: any = await this.firebaseDataService.fetchData('posts');
      if (response) {
        this.posts = Object.keys(response).map(key => ({ id: key, ...response[key] }));
        this.posts = this.posts.map(post => ({
          ...post,
          formattedDate: this.formatTimestamp(post.time)
        }));
        this.posts = [...this.posts].reverse();
        // console.log(this.posts)
      } else {
        this.posts = [];
      }
    } catch (error) {
      console.error('Error loading posts:', error);
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
