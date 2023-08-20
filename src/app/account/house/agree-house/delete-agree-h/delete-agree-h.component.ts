import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

@Component({
  selector: 'app-delete-agree-h',
  templateUrl: './delete-agree-h.component.html',
  styleUrls: ['./delete-agree-h.component.scss']
})
export class DeleteAgreeHComponent implements OnInit {

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


