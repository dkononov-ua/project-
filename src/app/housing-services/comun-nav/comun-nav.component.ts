import { Component } from '@angular/core';
import { DiscussioViewService } from 'src/app/services/discussio-view.service';
import { ViewComunService } from 'src/app/services/view-comun.service';
@Component({
  selector: 'app-comun-nav',
  templateUrl: './comun-nav.component.html',
  styleUrls: ['./comun-nav.component.scss'],
})

export class ComunNavComponent {
  discussio_view: boolean = false;
  selectedView: any;
  selectedName: string | null | undefined;

  indexPage: number = 0;

  constructor (
    private discussioViewService: DiscussioViewService,
    private selectedViewComun: ViewComunService,

  ) {  }

  ngOnInit(): void {
    this.getSelectParam();
  }

  getSelectParam() {
    this.discussioViewService.discussioView$.subscribe((discussio_view: boolean) => {
      this.discussio_view = discussio_view;
    });

    this.selectedViewComun.selectedView$.subscribe((selectedView: string | null) => {
      this.selectedView = selectedView;
    });

    this.selectedViewComun.selectedName$.subscribe((selectedName: string | null) => {
      this.selectedName = selectedName;
    });
  }

}

