import { trigger, transition, style, animate, state } from '@angular/animations';

export const animations = {

  left: trigger('left', [
    transition('void => *', [
      style({ transform: 'translateX(230%)' }),
      animate('1000ms 0ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  left1: trigger('left1', [
    transition('void => *', [
      style({ transform: 'translateX(230%)' }),
      animate('1200ms 50ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  left2: trigger('left2', [
    transition('void => *', [
      style({ transform: 'translateX(230%)' }),
      animate('1400ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  left3: trigger('left3', [
    transition('void => *', [
      style({ transform: 'translateX(230%)' }),
      animate('1600ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  left4: trigger('left4', [
    transition('void => *', [
      style({ transform: 'translateX(230%)' }),
      animate('1800ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  left5: trigger('left5', [
    transition('void => *', [
      style({ transform: 'translateX(230%)' }),
      animate('2000ms 800ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  right: trigger('right', [
    transition('void => *', [
      style({ transform: 'translateX(-230%)' }),
      animate('1000ms 0ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  right1: trigger('right1', [
    transition('void => *', [
      style({ transform: 'translateX(-230%)' }),
      animate('1200ms 50ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  right2: trigger('right2', [
    transition('void => *', [
      style({ transform: 'translateX(-230%)' }),
      animate('1400ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  right4: trigger('right4', [
    transition('void => *', [
      style({ transform: 'translateX(-230%)' }),
      animate('1800ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
  ]),

  swichCard: trigger('swichCard', [
    transition('void => *', [
      style({ transform: 'translateX(130%)' }),
      animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
    transition('* => void', [
      style({ transform: 'translateX(0)' }),
      animate('1200ms ease-in-out', style({ transform: 'translateX(130%)' }))
    ]),
  ]),

  top: trigger('top', [
    transition(':enter', [
      style({ transform: 'translateY(120%)', opacity: 0 }),
      animate('300ms 0ms', style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
  ]),

  top1: trigger('top1', [
    transition(':enter', [
      style({ transform: 'translateY(120%)', opacity: 0 }),
      animate('400ms 100ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
  ]),

  top2: trigger('top2', [
    transition(':enter', [
      style({ transform: 'translateY(120%)', opacity: 0 }),
      animate('500ms 200ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
  ]),

  top3: trigger('top3', [
    transition(':enter', [
      style({ transform: 'translateY(120%)', opacity: 0 }),
      animate('600ms 300ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
  ]),

  top4: trigger('top4', [
    transition(':enter', [
      style({ transform: 'translateY(120%)', opacity: 0 }),
      animate('700ms 400ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
  ]),

  cardSwipeAnimation: trigger('cardSwipe', [
    state('notSwiped', style({ transform: 'translateX(0)' })),
    state('swiped', style({ transform: 'translateX(100%)' })),
    transition('notSwiped <=> swiped', animate('1200ms ease-in-out')),
  ]),


  bot: trigger('bot', [
    transition('void => *', [
      style({ transform: 'translateY(-100%)' }),
      animate('1200ms 0ms ease-in-out', style({ transform: 'translateY(0)' }))
    ]),
  ]),


};
