import { Component, OnInit } from '@angular/core';
import { path_logo } from 'src/app/config/server-config';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  path_logo = path_logo;
  selectedFlatId!: string | null;

  constructor(
    private selectedFlatService: SelectedFlatService
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
