import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ]
})
export class DocumentsComponent {
  files = [
    { name: 'документи на оселю', url: 'assets/files/documents.pdf' },
    { name: 'угода про оренду', url: 'assets/files/lease_agreement.pdf' },
    { name: 'інші файли', url: 'assets/files/other_files.pdf' }
  ];
}
