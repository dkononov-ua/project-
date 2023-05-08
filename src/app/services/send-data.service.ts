import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  private baseUrl = 'http://localhost:3000/search/flat';

  constructor(private http: HttpClient) { }

sendFormData(formData: any) {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.post(`${this.baseUrl}/form-data`, formData.toString(), { headers });
}

}
