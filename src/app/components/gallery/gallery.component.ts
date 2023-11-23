import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  currentPhotoIndex: number = 0;
  @ViewChild('fullscreenImg') fullscreenImg: ElementRef | undefined;
  @ViewChild('imgContainer') imgContainer: ElementRef | undefined;
  private zoomLevel: number = 1;

  private offsetX: number = 0;
  private offsetY: number = 0;
  private isDragging: boolean = false;



  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

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

  zoomIn() {
    this.zoomLevel += 0.1;
    this.updateImageSize();
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
      this.updateImageSize();
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    const img = this.fullscreenImg?.nativeElement as HTMLImageElement;
    const container = this.imgContainer?.nativeElement as HTMLElement;

    // Отримання позиції курсора відносно контейнера
    const mouseX = event.clientX - container.getBoundingClientRect().left;
    const mouseY = event.clientY - container.getBoundingClientRect().top;

    // Визначення напрямку зумування на основі значення deltaY
    const zoomDirection = event.deltaY < 0 ? 1 : -1;

    // Визначення нового рівня зумування
    const newZoomLevel = this.zoomLevel + zoomDirection * 0.1;

    // Обчислення нового положення зображення відносно курсора
    const deltaX = (mouseX / img.width) * (this.zoomLevel - newZoomLevel);
    const deltaY = (mouseY / img.height) * (this.zoomLevel - newZoomLevel);

    // Оновлення рівня зумування та положення
    this.zoomLevel = newZoomLevel;
    this.offsetX += deltaX;
    this.offsetY += deltaY;

    // Виклик функції для оновлення розмірів та положення зображення
    this.updateImageSize();

    event.preventDefault();
  }


  private updateImageSize() {
    if (this.fullscreenImg && this.imgContainer) {
      const img = this.fullscreenImg.nativeElement as HTMLImageElement;
      const container = this.imgContainer.nativeElement as HTMLElement;

      const mouseX = container.scrollLeft + (container.offsetWidth / 2);
      const mouseY = container.scrollTop + (container.offsetHeight / 2);

      const imgRect = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const newWidth = img.width * this.zoomLevel;
      const newHeight = img.height * this.zoomLevel;

      const deltaX = (mouseX - containerRect.left) / imgRect.width * (newWidth - container.offsetWidth);
      const deltaY = (mouseY - containerRect.top) / imgRect.height * (newHeight - container.offsetHeight);

      img.style.transform = `scale(${this.zoomLevel})`;
      container.scrollLeft = Math.max(0, deltaX);
      container.scrollTop = Math.max(0, deltaY);
    }
  }







}
