import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApploadService {
  private  url="http://localhost/e-safe-data/src/assets/api/subscriber/";
  constructor(private httpClient: HttpClient) { }

  autoSubscription(): Promise<Object>{
    const response = this.httpClient.get(this.url+"autoSubscription")
      .toPromise()
      .then(res => {
        console.log('response: ', res );
        return res;
      });

    return response;    
  }

 
}
