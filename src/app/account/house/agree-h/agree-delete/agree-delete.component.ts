import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

@Component({
  selector: 'app-agree-delete',
  templateUrl: './agree-delete.component.html',
  styleUrls: ['./agree-delete.component.scss']
})
export class AgreeDeleteComponent implements OnInit {

  selectedFlatId!: string | null;
  selectedFlatAgree: any;
  selectedAgreement: any;

  constructor(
    private selectedFlatService: SelectedFlatService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getSelectParam()
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.route.params.subscribe(async params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
      console.log(this.selectedFlatAgree)
    });
  }
}



