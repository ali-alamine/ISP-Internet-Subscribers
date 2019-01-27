import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private url = "http://localhost/e-safe-data/src/assets/api/clients/";

  constructor(private httpClient: HttpClient) { }

  addNewClient(clientData): Observable<any> {
    return this.httpClient.post(this.url + "client", clientData);
  }

  editClient(clientData): Observable<any> {
    return this.httpClient.put(this.url + "client", clientData);
  }

  newPayment(paymentData): Observable<any> {
    return this.httpClient.put(this.url + "payment", paymentData);
  }

  totalDebit(): Observable<any> {
    return this.httpClient.get(this.url + "totalDebit");
  }

}

