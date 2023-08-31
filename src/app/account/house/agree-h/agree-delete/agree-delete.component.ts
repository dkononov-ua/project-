import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  offer!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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
  }
}



