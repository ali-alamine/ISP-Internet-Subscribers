import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileDrawerService {

  private url="http://localhost/e-safe-data/src/assets/api/drawer/";
  constructor(private httpClient: HttpClient) { }

  getMobileDrawer():Observable<any>{
    return this.httpClient.get(this.url+"mobileDrawer");
  }
  getMobileDetailsDay(data):Observable<any>{
    return this.httpClient.get(this.url+"getMobileDetailsDay", {params:{day:data}});
  }
}
