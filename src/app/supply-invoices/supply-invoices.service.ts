import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SupplyInvoicesService {
  private url="http://localhost/e-safe-data/src/assets/api/supplyInvoices/";
  constructor(private httpClient: HttpClient) { }

  getInvoiceDetails(data):Observable<any>{
    return this.httpClient.get(this.url+"invoiceDetails", {params:{invoiceID:data}});
  }

  getInvoicePayments(data):Observable<any>{
    return this.httpClient.get(this.url+"invoicePayments", {params:{invoiceID:data}});
  }

  newPayment(data):Observable<any>{
    return this.httpClient.post(this.url+"payment", data);
  }
}
