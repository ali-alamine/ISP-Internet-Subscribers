import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternetDrawerService {

  private url="http://localhost/e-safe-data/src/assets/api/drawer/";
  constructor(private httpClient: HttpClient) { }

  getInternetDrawer():Observable<any>{
    return this.httpClient.get(this.url+"internetDrawer");
  }

  getInternetDetailsDay(data):Observable<any>{
    return this.httpClient.get(this.url+"getInternetDetailsDay", {params:{day:data}});
  }

}





