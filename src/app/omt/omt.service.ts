import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OmtService {

  private url = "http://localhost/e-safe-data/src/assets/api/omt/";

  constructor(private httpClient: HttpClient) { }

  searchClient(searchInput){
    return this.httpClient.get('http://localhost/e-safe-data/src/assets/api/sell/searchClient',{params:{searchInput:searchInput}});
  }

  addOMTOperation(data): Observable<any> {
    return this.httpClient.post(this.url + "addOMTOperation", data);
  }

  deleteOperation(data){
    var data2 = JSON.stringify(data)
    return this.httpClient.get(this.url + 'deleteOperation',{params:{data:data2}});
  }

  setTransactionAsPaid(operationID,personID,amount){
    return this.httpClient.get(this.url + 'setTransactionAsPaid',{params:{operID:operationID,personID:personID,amountL:amount}});
  }

  omtTotalToday(){
    return this.httpClient.get(this.url + 'omtTotalToday');
  }
}
