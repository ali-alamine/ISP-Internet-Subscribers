import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditInvoicesService {

  private url="http://localhost/e-safe-data/src/assets/api/invoices/";
  constructor(private httpClient: HttpClient) { }

  deleteInvoice(data):Observable<any>{
    console.log(data) 
    return this.httpClient.put(this.url+"deleteRechargeCardInvoice",data);
  }
}
