import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private url = "http://localhost/e-safe-data/src/assets/api/settings/";

  constructor(private httpClient: HttpClient) { }

  uploadScript(file: File): Observable<any> {
    return this.httpClient.post(this.url + "restoreUpload", file);
  }

  backup(): any {
    return this.httpClient.get(this.url + "backup", { responseType: 'arraybuffer' }).subscribe(response => this.downLoadFile(response, "application/zip"));
  }
  changePass(data) {
    return this.httpClient.post(this.url + "changePass",data);
  }
  
  downLoadFile(data: any, type: string) {
    var blob = new Blob([data], { type: type });
    var url = window.URL.createObjectURL(blob);
    var pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
  // getUser(): Observable<any> {
  //   return this.httpClient.get("http://localhost/DMD-Inventory/src/assets/api/login/getUser");
  // }
  // editUser(user): Observable<any> {
  //   return this.httpClient.put("http://localhost/DMD-Inventory/src/assets/api/login/editUser", user);
  // }
}
