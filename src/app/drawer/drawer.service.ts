import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  private url="http://localhost/e-safe-data/src/assets/api/drawer/";

  constructor(private httpClient: HttpClient) { }

  setDrawer(data): Observable<any>{
    return this.httpClient.post(this.url+"setDrawer",data);
  }
  newOperation(data): Observable<any>{
    return this.httpClient.post(this.url+"newOperation",data);
  }

  newTransferOperation(data):Observable<any>{
    return this.httpClient.post(this.url+"newTransferOperation",data);
  }
  
  getOmtDrawer():Observable<any>{
    return this.httpClient.get(this.url+"omtDrawer");
  }

  getOmtDrawerDetails(data):Observable<any>{
    return this.httpClient.get(this.url+"getOmtDrawerDetails", {params:{day:data}});
  }
}
