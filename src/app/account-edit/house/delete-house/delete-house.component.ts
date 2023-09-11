import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-house',
  templateUrl: './delete-house.component.html',
  styleUrls: ['./delete-house.component.scss']
})
export class DeleteHouseComponent implements OnInit {
  selectedFlatName: any;

  constructor() { }

  ngOnInit(): void {
    const houseJson = localStorage.getItem('house');
    if (houseJson) {
      this.selectedFlatName = JSON.parse(houseJson).flat_name;
      console.log(this.selectedFlatName);
    }
  }
}
