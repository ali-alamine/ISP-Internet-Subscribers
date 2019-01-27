import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private url="http://localhost/e-safe-data/src/assets/api/subscriber/";
  constructor(private httpClient: HttpClient) { }

  // togglePayment(data):Observable<any>{
  //   const myObj = {
  //     id: data
  //   };
  //   const myObjStr = JSON.stringify(myObj);
  //   console.log(myObjStr)
  //   return this.httpClient.put(this.url+"setUnsetPayment",JSON.parse(myObjStr));
  // }
  togglePayment(data,isPaid,profile,subID):Observable<any>{
    
    const myObj = {
      id: data,
      isPaid : isPaid,
      profile:profile,
      subID:subID

    };
    const myObjStr = JSON.stringify(myObj);
    
    return this.httpClient.put(this.url+"setUnsetPayment",JSON.parse(myObjStr));
  }
  checkPass(pass) {
    // alert("checking pass")
    var data={"pass":pass};
    console.log(data)
    return this.httpClient.post("http://localhost/e-safe-data/src/assets/api/settings/checkPassword",data);
  }
  deleteSubscription(data):Observable<any>{
    const myObj = {
      id: data
    };
    const myObjStr = JSON.stringify(myObj);
    return this.httpClient.put(this.url+"deleteSubscription",JSON.parse(myObjStr));
  }
}
