import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { ApiHelperProvider , SessionHelperProvider , ConfigTablesProvider , AppUtilsProvider ,ProductsProvider } from '../providers/providers';
import { HttpClientModule } from '@angular/common/http';
import { File } from '@ionic-native/file'
import { FileTransfer } from '@ionic-native/file-transfer';
import { SQLite } from '@ionic-native/sqlite';
import { DatePipe } from '@angular/common';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ComponentsModule } from '../components/components.module';
import { DecimalPipe } from '@angular/common';
import { HomePage } from '../pages/home/home';
import { MainHomePage } from '../pages/main-home/main-home';
import { ProductListingPage } from '../pages/product-listing/product-listing';
import { ApiloginPage } from '../pages/apilogin/apilogin'
import { SyncDataPage } from '../pages/sync-data/sync-data'



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainHomePage,
    ProductListingPage,
    SyncDataPage,
    ApiloginPage 
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    RoundProgressModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MainHomePage,
    ProductListingPage,
    SyncDataPage,
    ApiloginPage 
  ],
  providers: [
    StatusBar,
    DecimalPipe,
    File,
    FileTransfer,
    ApiHelperProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    DatePipe,
    SessionHelperProvider,
    ConfigTablesProvider,
    AppUtilsProvider,
    ProductsProvider
  
  ]
})
export class AppModule {}
