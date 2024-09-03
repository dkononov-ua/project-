import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts-last',
  templateUrl: './posts-last.component.html',
  styleUrls: ['./../posts.component.scss'],
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
export class PostsLastComponent implements OnInit {

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

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
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
    // console.log(post)
    this.selectedPost = true;
    this.selectedPostID = post.id;
  }

  async loadPosts() {
    const posts = await this.postService.getPosts();
    if (posts) {
      this.posts = posts.slice(-3); // Вибираємо останні 4 пости
    }
  }


}
