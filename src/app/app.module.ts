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
import { ProductDetailsPage } from '../pages/product-details/product-details';
import { SyncDataPage } from '../pages/sync-data/sync-data';
import { PipesModule } from '../pipes/pipes.module' ;
import { HTTP } from '@ionic-native/http';
import {CartDetailsPage} from '../pages/cart-details/cart-details';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SharedhelperProvider } from '../providers/sharedhelper/sharedhelper';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainHomePage,
    ProductListingPage,
    SyncDataPage,
    ApiloginPage ,
    ProductDetailsPage,
    CartDetailsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    PipesModule,
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
    ApiloginPage ,
    ProductDetailsPage,
    CartDetailsPage
  ],
  providers: [
    StatusBar,
    DecimalPipe,
    File,
    BackgroundMode,
    LocalNotifications,
    FileTransfer,
    ApiHelperProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    DatePipe,
    HTTP,
    SessionHelperProvider,
    ConfigTablesProvider,
    AppUtilsProvider,
    ProductsProvider,
    SharedhelperProvider
  ]
})
export class AppModule {}
