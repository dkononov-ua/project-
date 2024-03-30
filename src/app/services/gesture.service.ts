import * as Hammer from 'hammerjs';
import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

@Injectable()

// додавання відслідковування свайпів
export class GestureService extends HammerGestureConfig {
  override buildHammer(element: HTMLElement) {
    const hammer = new Hammer(element);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    return hammer;
  }
}
