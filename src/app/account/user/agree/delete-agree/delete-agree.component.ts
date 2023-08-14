import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

@Component({
  selector: 'app-delete-agree',
  templateUrl: './delete-agree.component.html',
  styleUrls: ['./delete-agree.component.scss']
})
export class DeleteAgreeComponent implements OnInit {

  selectedFlatId!: string | null;
  selectedComun!: string | null;
  selectedYear!: string | null;
  selectedMonth!: string | null;

  constructor(
    private selectedFlatService: SelectedFlatService,
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


