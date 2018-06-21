import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SessionHelperProvider, AppUtilsProvider } from '../../providers/providers';
import { normalizeURL } from 'ionic-angular';
import { File } from '@ionic-native/file';

/**
 * Generated class for the MainHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-main-home',
  templateUrl: 'main-home.html',
})
export class MainHomePage {

  sliderImages = [];
  tempImagePath ;
  constructor(public navCtrl: NavController, public navParams: NavParams, private file: File,
               public sessionProvider: SessionHelperProvider, public appUtils: AppUtilsProvider) {

  }

  ionViewDidLoad() {
    
    this.sessionProvider.GetBackImages().then((val)=>{
      //this.tempImagePath = normalizeURL(imagePath);
      let slider = val.split(','); 
      this.sliderImages.push(normalizeURL(this.file.dataDirectory + slider[0])); 
      this.sliderImages.push(normalizeURL(this.file.dataDirectory + slider[1])); 
     // this.sliderImages = val.split(',');
      // var imagePath = this.file.dataDirectory + "5126acc4.png";
      // console.log("**Image Path" , imagePath); 
      // this.tempImagePath = normalizeURL(imagePath);
      // console.log("**Temp Image Path" , this.tempImagePath);
      }).catch(error =>{
        console.log("API ERROR" , error);
      });


    console.log('ionViewDidLoad MainHomePage');
     
    this.appUtils.AddScreenHeader("home" , "Home" , "");

   }


  

 



}
