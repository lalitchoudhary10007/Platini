import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LoadingController } from 'ionic-angular' ;

/*
  Generated class for the ApiHelperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiHelperProvider {
  loading = null ;
  apiUrl = 'http://50.63.172.206/API/Test/';

  constructor(public http: HttpClient , public loadingCtrl: LoadingController) {
    console.log('Hello ApiHelperProvider Provider');
 
  }

  public RequestPostHttp(data: any , endpoint) : Observable<any>{
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
     
    });
   this.loading.present();
    return this.http.post(this.apiUrl+endpoint , JSON.stringify(data) , {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin','*').append('Access-Control-Allow-Methods' , 'POST, GET, OPTIONS, PUT')
      .append('Accept' , 'application/json').append('content-type' , 'application/json'),
    })  .map((res: Response) => this.SendResponse(res))
        .catch((error) => this.handleError(error));; 
}

private SendResponse(res:any){
  this.loading.dismiss();
  return res ;
}

private handleError (error: any) {
  this.loading.dismiss();
  // Could dig deeper into the error to get a better message or use a remote logging infrastructure
  let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
  console.error("ERROR",errMsg); // log to console instead
  return Observable.throw(errMsg);
}

}
