import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
/*
  Generated class for the AppUtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppUtilsProvider {

  ScreenHeaders: any = [];

  constructor(private datePipe: DatePipe , private decimalPipe: DecimalPipe) {
    console.log('Hello AppUtilsProvider Provider');
  }


  GetCurrentDateTime(){

    var datetime = this.datePipe.transform(new Date() , 'yyyy-MM-dd hh:mm:ss');
    return datetime ;

  }

  GetFeatureDateFormat(date){
    var datetime = this.datePipe.transform(date , 'd MMM y');
  //  console.log("FORMATED",datetime);
    return datetime ;
  }


  twoDecimals(number) {
    return this.decimalPipe.transform(number, '1.2-2');
   }


   AddScreenHeader(title , type , typeid){

    this.ScreenHeaders.push({
      header_title:title,
      header_type:type,
      header_type_id:typeid
    });

   }

  

}
