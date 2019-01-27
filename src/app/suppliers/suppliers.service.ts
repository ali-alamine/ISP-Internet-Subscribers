import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private url="http://localhost/e-safe-data/src/assets/api/suppliers/";
  constructor(private httpClient: HttpClient) { }

  addNewSupplier(supplierData): Observable<any>{
    return this.httpClient.post(this.url+"supplier", supplierData);
  }

  editSupplier(supplierData): Observable<any>{
    return this.httpClient.put(this.url+"supplier", supplierData);
  }

  newPayment(paymentData): Observable<any>{
    return this.httpClient.put(this.url+"payment", paymentData);
  }
}


