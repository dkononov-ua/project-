import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  currentPhotoIndex: number = 0;
  @ViewChild('fullscreenImg') fullscreenImg: ElementRef | undefined;
  @ViewChild('imgContainer') imgContainer: ElementRef | undefined;
  private zoomLevel: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private isDragging: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
  ) {
    // console.log(data)
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
  }

  prevPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    }
  }

  nextPhoto() {
    if (this.currentPhotoIndex < this.data.photos.length - 1) {
      this.currentPhotoIndex++;
    }
  }

  // В компоненті
  zoomIn(): void {
    const img = this.fullscreenImg?.nativeElement as HTMLImageElement | undefined;
    const container = this.imgContainer?.nativeElement as HTMLElement | undefined;

    if (img && container) {
      const mouseX = container.offsetWidth / 2;
      const mouseY = container.offsetHeight / 2;

      const zoomDirection = 1;
      const newZoomLevel = this.zoomLevel + zoomDirection * 0.1;

      const deltaX = (mouseX / img.width) * (this.zoomLevel - newZoomLevel);
      const deltaY = (mouseY / img.height) * (this.zoomLevel - newZoomLevel);

      this.zoomLevel = newZoomLevel;
      this.offsetX += deltaX;
      this.offsetY += deltaY;

      this.updateImageSize();
    }
  }

  zoomOut(): void {
    const img = this.fullscreenImg?.nativeElement as HTMLImageElement | undefined;
    const container = this.imgContainer?.nativeElement as HTMLElement | undefined;

    if (img && container) {
      const mouseX = container.offsetWidth / 2;
      const mouseY = container.offsetHeight / 2;

      const zoomDirection = -1;
      const newZoomLevel = this.zoomLevel + zoomDirection * 0.1;

      const deltaX = (mouseX / img.width) * (this.zoomLevel - newZoomLevel);
      const deltaY = (mouseY / img.height) * (this.zoomLevel - newZoomLevel);

      this.zoomLevel = newZoomLevel;
      this.offsetX += deltaX;
      this.offsetY += deltaY;

      this.updateImageSize();
    }
  }

  private updateImageSize() {
    const img = this.fullscreenImg?.nativeElement as HTMLImageElement | undefined;
    const container = this.imgContainer?.nativeElement as HTMLElement | undefined;

    if (img && container) {
      const mouseX = container.scrollLeft + (container.offsetWidth / 2);
      const mouseY = container.scrollTop + (container.offsetHeight / 2);

      const imgRect = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const newWidth = img.width * this.zoomLevel;
      const newHeight = img.height * this.zoomLevel;

      const deltaX = (mouseX - containerRect.left) / imgRect.width * (newWidth - container.offsetWidth);
      const deltaY = (mouseY - containerRect.top) / imgRect.height * (newHeight - container.offsetHeight);

      img.style.transform = `scale(${this.zoomLevel})`;
      img.style.transformOrigin = 'top left';
      container.scrollLeft = Math.max(0, deltaX);
      container.scrollTop = Math.max(0, deltaY);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const img = this.fullscreenImg?.nativeElement as HTMLImageElement | undefined;

      if (img) {
        this.offsetX += event.movementX / img.width;
        this.offsetY += event.movementY / img.height;
        this.updateImageSize();
      }
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.isDragging = false;
  }
}
