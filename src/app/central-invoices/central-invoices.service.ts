import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CentralInvoicesService {
  private url="http://localhost/e-safe-data/src/assets/api/centralInvoice/";
  constructor(private httpClient: HttpClient) { }

  deleteInvoice(data):Observable<any>{   
    return this.httpClient.put(this.url+"deleteInvoice",data);
  }
  
  deleteInvoiceWoChange(data):Observable<any>{   
    return this.httpClient.put(this.url+"deleteInvoiceWOChange",data);
  }
}
