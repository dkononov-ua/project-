import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-delete-comunal',
  templateUrl: './delete-comunal.component.html',
  styleUrls: ['./delete-comunal.component.scss']
})
export class DeleteComunalComponent implements OnInit {

  house = {
    flat_id: '',
  };

  comunal = {
    comunal_name: '',
  };

  constructor(private http: HttpClient, private dataService: DataService) {  }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    const selectedComunal = localStorage.getItem('comunal_name')
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {
          if (response.houseData) {
            this.house.flat_id = response.houseData.flat.flat_id;
            this.dataService.getComunalInfo(userJson, this.house.flat_id, this.comunal.comunal_name ).subscribe((response: any) => {
              if(selectedComunal){
                console.log(JSON.parse(selectedComunal).comunal)
                this.comunal = {comunal_name : JSON.parse(selectedComunal).comunal}
              }
            });
          } else {
            console.error('houseData field is missing from server response');
          }
        });
      }
    }
  }

}
