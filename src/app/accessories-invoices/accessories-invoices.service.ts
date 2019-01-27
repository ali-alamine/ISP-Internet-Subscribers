import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccessoriesInvoicesService {

  private url="http://localhost/e-safe-data/src/assets/api/invoices/";
  constructor(private httpClient: HttpClient) { }


  deleteInvoice(data):Observable<any>{   
    return this.httpClient.put(this.url+"deleteInvoice",data);
  }
}
