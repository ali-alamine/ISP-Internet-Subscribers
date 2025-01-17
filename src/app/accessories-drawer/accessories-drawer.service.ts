import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessoriesDrawerService {

  private url="http://localhost/e-safe-data/src/assets/api/drawer/";
  constructor(private httpClient: HttpClient) { }

  getAccDrawer():Observable<any>{
    return this.httpClient.get(this.url+"accDrawer");
  }
  getAccDetailsDay(data):Observable<any>{
    return this.httpClient.get(this.url+"getAccDetailsDay", {params:{day:data}});
  }
}
