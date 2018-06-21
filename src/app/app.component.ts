import { Component } from '@angular/core';
import { Platform, AlertController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigTablesProvider, ProductsProvider } from './../providers/providers';
import { HomePage } from '../pages/home/home';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
 
  constructor(public platform: Platform, statusBar: StatusBar, public  app: App,
    configProvider: ConfigTablesProvider, productsProvider: ProductsProvider, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    //  statusBar.styleDefault();
      // this.imageLoaderConfig.enableDebugMode();
      // this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      // this.imageLoaderConfig.setFallbackUrl('assets/imgs/no_image.jpg');
      // this.imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024);
      // this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000);
      // this.imageLoaderConfig.setConcurrency(5);
      configProvider.CreateConfigTables();
      productsProvider.CreateProductsTables();
    //  platform.registerBackButtonAction(()=>this.myHandlerFunction());

     // splashScreen.hide();
    });
  }

  myHandlerFunction(){
    
    // let nav = this.app.getActiveNavs()[0];
    //             let activeView = nav.getActive();                

    //             if(activeView.name === "HomePage") {

    //                 if (nav.canGoBack()){ //Can we go back?
    //                     nav.pop();
    //                 } else {
    //                     const alert = this.alertCtrl.create({
    //                         title: 'App termination',
    //                         message: 'Do you want to close the app?',
    //                         buttons: [{
    //                             text: 'Cancel',
    //                             role: 'cancel',
    //                             handler: () => {
    //                                 console.log('Application exit prevented!');
    //                             }
    //                         },{
    //                             text: 'Close App',
    //                             handler: () => {
    //                                 this.platform.exitApp(); // Close this application
    //                             }
    //                         }]
    //                     });
    //                     alert.present();
    //                 }
    //               }
    //         }
      


    

  }
}

