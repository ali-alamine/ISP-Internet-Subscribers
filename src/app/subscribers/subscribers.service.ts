import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DateAdapter } from '@angular/material';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class SubscribersService {

  private url="http://localhost/e-safe-data/src/assets/api/subscriber/";
  constructor(private httpClient: HttpClient) { }

  addNewSubscriber(subscriberData): Observable<any>{
    console.log(subscriberData)
    return this.httpClient.post(this.url+"subscriber", subscriberData);
  }

  editSubscriber(data): Observable<any> {
    console.log(data);
    return this.httpClient.put(this.url+"subscriber", data);
  }
  
  autoSubscription():Observable<any>{
    return this.httpClient.get(this.url+"autoSubscription");
  }

  getMonths(data):Observable<any>{
    return this.httpClient.get(this.url+"getMonths", {params:{subscriberID:data}});
  }

  toggleSubscriberActivation(data):Observable<any>{
    const myObj = {
      id: data
    };
    const myObjStr = JSON.stringify(myObj);
    
    return this.httpClient.put(this.url+"enableDisableSub",JSON.parse(myObjStr));
  }
  togglePayment(data,isPaid,profile,subID):Observable<any>{
    // alert(profile)
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
    
    var data={"pass":pass};
    return this.httpClient.post("http://localhost/e-safe-data/src/assets/api/settings/checkPassword",data);
  }
  submitDebitPaymentAmount(data){
    return this.httpClient.put(this.url+"submitDebitPaymentAmount",data);
  }
  newSubscription(data):Observable<any>{
    var subdateFormated = formatDate(data['subDate'],'yyyy-MM-dd','en');
    var expdateFormated = formatDate(data['expDate'],'yyyy-MM-dd','en');
    data['subDate']=subdateFormated;
    data['expDate']=expdateFormated;

    console.log(data)
    return this.httpClient.post(this.url+"newSubscription",data);
  }

  
}
