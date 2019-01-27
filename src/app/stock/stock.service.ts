import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private url="http://localhost/AllSubse-safe-datacribers/src/assets/api/stock/";
  constructor(private httpClient: HttpClient) { }
  addNewAcc(accData): Observable<any>{
    return this.httpClient.post(this.url+"stockAcc", accData);
  }
  addNewMRC(MRCData): Observable<any>{
    return this.httpClient.post(this.url+"stockMRC", MRCData);
  }
  addNewOF(OFData): Observable<any>{
    return this.httpClient.post(this.url+"stockOF", OFData);
  }
  editAcc(data): Observable<any> {
    return this.httpClient.put(this.url+"stockAcc", data);
  }
  editMRC(data): Observable<any> {
    return this.httpClient.put(this.url+"stockMRC", data);
  }
  editOF(data): Observable<any> {
    return this.httpClient.put(this.url+"stockOF", data);
  }
  editCT(data): Observable<any> {
    return this.httpClient.put(this.url+"stockCT", data);
  }
}
