import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  private url="http://localhost/e-safe-data/src/assets/api/supply/";
  constructor(private httpClient: HttpClient) {}

  searchSupplier(data):Observable<any>{
    return this.httpClient.get(this.url+"searchSupplier", {params:{keyword:data}});
  }  
  searchItem(data,type):Observable<any>{
    return this.httpClient.get(this.url+"searchItem", {params:{keyword:data,type:type}});
  } 
  addSupply(supplyData): Observable<any>{
    console.log(supplyData)
    return this.httpClient.post(this.url+"addSupply", supplyData);
  }
}
