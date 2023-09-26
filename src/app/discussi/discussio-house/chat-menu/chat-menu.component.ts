import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { Location } from '@angular/common';
import { serverPath } from 'src/app/shared/server-config';
@Component({
  selector: 'app-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
})

export class ChatMenuComponent implements OnInit, AfterViewInit {

  loading: boolean = true;

  isMenuOpen = true;
  isChatOpenStatus: boolean = true;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  goBack(): void {
    this.location.back();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  selectedFlatId: any;
  infoPublic: any[] | undefined;
  chats: any;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private location: Location
  ) { }

  async ngOnInit(): Promise<any> {
    this.getSelectedFlatId();
    await this.getChats();
    this.loading = false;
  }

  getSelectedFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  async getChats(): Promise<any> {
    const url = serverPath + '/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: 0
      };

      try {
        const response = await this.http.post(url, data).toPromise() as any;
        console.log(response)
        this.chats = response.status;
        console.log(this.chats)
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not found');
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }


}
