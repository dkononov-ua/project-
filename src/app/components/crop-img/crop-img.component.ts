import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { StyleRenderer, WithStyles, lyl, ThemeRef, ThemeVariables } from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { LySliderChange, STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import {
  STYLES as CROPPER_STYLES,
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent,
  ImgResolution
} from '@alyle/ui/image-cropper';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(SLIDER_STYLES);
  ref.renderStyleSheet(CROPPER_STYLES);
  const slider = ref.selectorsOf(SLIDER_STYLES);
  const cropper = ref.selectorsOf(CROPPER_STYLES);

  return {
    root: lyl `{
      ${cropper.root} {
        width: 100%
        height: 50vh
        margin: 0
      }
    }`,
    sliderContainer: lyl `{
      position: relative
      ${slider.root} {
        width: 100%
        position: absolute
        left: 0
        margin: auto
        top: 0
      }
    }`,
  };
};
@Component({
  selector: 'app-crop-img',
  templateUrl: './crop-img.component.html',
  styleUrls: ['./crop-img.component.scss']
})

export class CropImgComponent implements WithStyles, AfterViewInit  {

  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  ready: boolean = false;
  scale: number = 1;
  minScale: number = 1;

  @ViewChild(LyImageCropper, { static: true }) cropper!: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 300,
    height: 400,
    type: 'image/png',
    keepAspectRatio: true,
    responsiveArea: true,
    output: ImgResolution.OriginalImage,
    resizableArea: true
  };
  constructor(
    @Inject(LY_DIALOG_DATA) private event: Event,
    readonly sRenderer: StyleRenderer,
    public dialogRef: LyDialogRef
  ) { }

  ngAfterViewInit() {
    this.dialogRef.afterOpened.subscribe(() => {
      this.cropper.selectInputEvent(this.event);
    });
  }

  onCropped(e: ImgCropperEvent) {
    // console.log('cropped img: ', e);
  }

  onLoaded(e: ImgCropperEvent) {
    // console.log('img loaded', e);
  }

  onError(e: ImgCropperErrorEvent) {
    // console.warn(`'${e.name}' is not a valid image`, e);
    this.dialogRef.close();
  }

  onSliderInput(event: LySliderChange) {
    this.scale = event.value as number;
  }

}
