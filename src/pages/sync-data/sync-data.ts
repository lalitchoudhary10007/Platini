import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, App , ToastController} from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { MainHomePage } from '../main-home/main-home';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ApiHelperProvider, SessionHelperProvider, ConfigTablesProvider, AppUtilsProvider, ProductsProvider } from '../../providers/providers';
/**
 * Generated class for the SyncDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-sync-data',
  templateUrl: 'sync-data.html',

})
export class SyncDataPage {

  BackImages: any = [];
  //   loading = null ;
  data = { UserId: 0, Mode: 0, SubMode: 7, DeviceInfo: 'Test Device', SyncDate: '2010-04-16 14:00:00.000' };
  backImagesPath: any = [];
  productIndex = 0;
  statusLoading = 'Loading';
  statusLoading1 = 'In Queue';
  statusLoading2 = 'In Queue';
  productImagesStatus = 'In Queue';

  constructor(public navCtrl: NavController, public ApiHelper: ApiHelperProvider, public loadingCtrl: LoadingController,public backgroundMode : BackgroundMode,
    private transfer: FileTransfer, private file: File, public sessionHelper: SessionHelperProvider,public appCtrl: App,public toastctrl: ToastController,
    public configProvider: ConfigTablesProvider, public appUtils: AppUtilsProvider, public productsProvider: ProductsProvider
  ) {

    backgroundMode.setDefaults({
      title:'Downloading',
      text: 'Data Downloading',
      icon: 'icon',
      color: '#F14F4D',
      resume: true,
      hidden: true,
      bigText: true
     });

  }

  ionViewDidLoad() {

    this.backgroundMode.enable();
    this.backgroundMode.on("EVENT").subscribe(event =>{
      console.log("** Event Changed" , event);
    });
    
    // this.SyncData();
    console.log('ionViewDidLoad SyncDataPage');
    //  this.SaveProductsImagesOffline();
    this.sessionHelper.GetValuesFromSession('SYNCJSON').then((val) => {
      if (val == null) {
        this.SyncData();
      } else {
        console.log("JSON IN SESSION", val);
        this.configProvider.GetAllUnCompleteEntity().subscribe(UnCompletedmilestones => {
          console.log("Uncomplete Milestones Length", UnCompletedmilestones.length);

          if (UnCompletedmilestones == 0) {
            console.log("NO Uncomplete Milestones");

          } else {

          }

        }, error => {
          console.log("ERROR", error);
        });

      }
    }).catch(error => {
      console.log("API ERROR", error);
    });



  }

  SyncData3() {
    this.sessionHelper.GetValuesFromSession('userid').then((val) => {
      this.data.UserId = val;
      this.data.Mode = 0;
      this.data.SubMode = 6;
      this.data.DeviceInfo = 'Test Device';
      this.data.SyncDate = '2010-04-16 14:00:00.000';
      this.statusLoading1 = 'API Running';

      this.ApiHelper.RequestPostHttp(this.data, 'FullSync', false).then(result => {
        //here you have the analog success function from an ajax call 
        //use the received data
        this.presentToast("Api Response Get Successfully"+this.appUtils.GetCurrentDateTime());
        this.SaveSizesMasterInDB(result);
      },
        error => {
          //here you have the analog error function from an ajax call 
          //treat the error
          console.log("ERROR", error);
        }
      );
    });

  }

  SaveSizesMasterInDB(result) {
    this.configProvider.UpdateImportEntity(8, 'Sizes Master', 1, 'NA', '', this.appUtils.GetCurrentDateTime());
   
      this.productsProvider.SaveSizesMaster(result.Sizes).subscribe(pos => {
        console.log("**MASTER SIZES COMPLETED",pos);
        this.presentToast("Sizes Master Saved Successfully"+this.appUtils.GetCurrentDateTime());
          this.SaveFitsMasterInDB(result);
       
      }, error => {
        console.log("SAVE SIZE MASTER ERROR", error);
      });
    

  }

  SaveFitsMasterInDB(result) {
    this.configProvider.UpdateImportEntity(9, 'Fits Master', 1, 'NA', '', this.appUtils.GetCurrentDateTime());
    
      this.productsProvider.SaveFitsMaster(result.Fits).subscribe(pos => {
        console.log("**MASTER FITS COMPLETED",pos);
        this.presentToast("Fits Master Saved Successfully"+this.appUtils.GetCurrentDateTime());
          this.SaveInseamMasterInDB(result);
       
      }, error => {
        console.log("SAVE FITS MASTER ERROR", error);
      });
    

  }

  SaveInseamMasterInDB(result) {

    this.configProvider.UpdateImportEntity(10, 'Inseam Master', 1, 'NA', '', this.appUtils.GetCurrentDateTime());
      this.productsProvider.SaveInseamMaster(result.Inseams).subscribe(pos => {
        console.log("**MASTER INSEAM COMPLETED",pos);
        this.presentToast("Inseam Master Saved Successfully"+this.appUtils.GetCurrentDateTime());
           this.SaveSizeGroupMasterInDB(result);
      }, error => {
        console.log("SAVE INSEAM MASTER ERROR", error);
      });
    
  }

  SaveSizeGroupMasterInDB(result) {

    this.configProvider.UpdateImportEntity(11, 'Size Group Master', 1, 'NA', '', this.appUtils.GetCurrentDateTime());
     this.productsProvider.SaveSizeGroupMaster(result.SizeGroups).subscribe(pos => {
      console.log("**MASTER SIZE GOUPS COMPLETED",pos);
      this.presentToast("Sizes Group Master Successfully"+this.appUtils.GetCurrentDateTime());
         this.BackgroundImagesDownload();
          this.openMainPage();
       }, error => {
        console.log("SAVE SIZE GROUP MASTER ERROR", error);
      });
    


  }


  SyncData() {

    this.sessionHelper.GetValuesFromSession('userid').then((val) => {
      this.data.UserId = val;
      this.data.Mode = 0;
      this.data.SubMode = 7;
      this.data.DeviceInfo = 'Test Device';
      this.data.SyncDate = '2010-04-16 14:00:00.000';
      this.statusLoading = 'API Running';

      console.log("USER IDD", this.data.UserId);

      this.ApiHelper.RequestPostHttp(this.data, 'FullSync', false).then(result => {
        //here you have the analog success function from an ajax call 
        //use the received data

        this.sessionHelper.SaveValueInSession("SYNCJSON", result);
        this.presentToast("Api Run Successfully"+this.appUtils.GetCurrentDateTime());


        var promises1 = [];

        for (var i = 0; i < result.BackgroundPictures.length; i++) {
          promises1.push(this.download(result.BackgroundPictures[i].picture, i + 1, result.BackgroundPictures.length, result.BackgroundPictures, result, 1));
        }

        Promise.all(promises1)
          .then((results) => {
            console.log("**All Back Images done", results);
            this.presentToast("Banners Saved Successfully"+this.appUtils.GetCurrentDateTime());
            var abc = this.backImagesPath.join();
            this.sessionHelper.SaveValueInSession('IMAGES', abc);
            this.configProvider.UpdateImportEntity(1, 'Background', "3", 'ALL', '', this.appUtils.GetCurrentDateTime());

            this.SaveTermsInDB(result);
            this.statusLoading = 'Image Downloaded Successfully';

          })
          .catch((e) => {
            // Handle errors here
            console.log("ERRORS", e);
          });


        this.statusLoading = 'Got Response';


      },
        error => {
          //here you have the analog error function from an ajax call 
          //treat the error
          this.statusLoading = 'API Failed';
          console.log("ERROR", error);
        }
      );

    });





  }

  SyncData2() {
    this.statusLoading = 'Completed';
    this.sessionHelper.GetValuesFromSession('userid').then((val) => {
      this.data.UserId = val;
      this.data.Mode = 0;
      this.data.SubMode = 5;
      this.data.DeviceInfo = 'Test Device';
      this.data.SyncDate = '2010-04-16 14:00:00.000';
      this.statusLoading1 = 'API Running';

      this.ApiHelper.RequestPostHttp(this.data, 'FullSync', false).then(result => {
        //here you have the analog success function from an ajax call 
        //use the received data
        this.presentToast("Api Response Get Successfully"+this.appUtils.GetCurrentDateTime());
        this.sessionHelper.SaveValueInSession("SYNCJSON", result);
        this.SaveCategoriesInDB(result);


      },
        error => {
          //here you have the analog error function from an ajax call 
          //treat the error
          console.log("ERROR", error);
        }
      );

    });

  }


  SaveCategoriesInDB(result) {

    this.configProvider.SaveCategoryINDB(result.Categories).subscribe(pos => {
      console.log("**CATEGORIES COMPLETED",pos);  
      this.presentToast("categories Saved Successfully"+this.appUtils.GetCurrentDateTime()); 
      this.SaveProductsInDB(result);
       }, error => {
        console.log("SAVE CATEGORIES ERROR", error);
      });
    
  }

  SaveProductsInDB(result) {
      this.productsProvider.SaveProducts(result.Clothes).subscribe(pos => {
        console.log("**PRODUCTS COMPLETED",pos);
        this.presentToast("Products Saved Successfully"+this.appUtils.GetCurrentDateTime());
          this.SaveProductImages(result);
        
      }, error => {
        console.log("SAVE PRODUCTS ERROR", error);
      });
    

  }


  SaveProductImages(result) {
  
   
      this.productsProvider.SaveImagesInTable(result.ClothesImages).subscribe(pos => {
        console.log("**PRODUCT IMAGES COMPLETED",pos);
        this.presentToast("Product Images Saved Successfully"+this.appUtils.GetCurrentDateTime());
       this.SaveProductScales(result);
        
      }, error => {
        console.log("SAVE CATEGORIES ERROR", error);
      });
    

  }

  SaveProductsImagesOffline() {
    this.statusLoading2 = 'Products Completed';
    this.productImagesStatus = 'Downloading Images Offline Started';
    this.presentToast("All Completed, Images Start In Background Successfully"+this.appUtils.GetCurrentDateTime());
    this.productsProvider.GetAllImagesFromDB().subscribe(res => {
      console.log("Products Images Length", res.rows.length);
      if (res.rows.length == 0) {
        console.log("**NO Products Images Found", "");
      } else {
        this.DownloadProductImages(res.rows.item(this.productIndex).imagePath, this.productIndex, res.rows.length, res);
      }

    }, error => {
      console.log("ERROR", error);
    });

  }


  SaveProductScales(result) {
    this.configProvider.UpdateImportEntity(6, 'Product Scales', 1, 'NA', '', this.appUtils.GetCurrentDateTime());
    
      this.productsProvider.SaveClothScales(result.ClothesScales).subscribe(pos => {
        console.log("**SCALES COMPLETED",pos);
        this.presentToast("Product Scales Saved Successfully"+this.appUtils.GetCurrentDateTime());
          this.SaveProductScaleSizes(result);
        
      }, error => {
        console.log("SAVE PRODUCT SCALES ERROR", error);
      });
    

  }

  SaveProductScaleSizes(result) {
    this.configProvider.UpdateImportEntity(7, 'Product Scales Sizes', 1, 'NA', '', this.appUtils.GetCurrentDateTime());
     this.productsProvider.SaveScaleSizes(result.ClothesScaleSizes).subscribe(pos => {
      console.log("**SCALE SIZES COMPLETED",pos);
      this.presentToast("Product Scale Sizes Saved Successfully"+this.appUtils.GetCurrentDateTime());
      this.SyncData3();
      }, error => {
        console.log("SAVE PRODUCT SCALE SIZES ERROR", error);
      });
    


  }





  openMainPage() {
    this.appCtrl.getRootNav().setRoot(MainHomePage);
  }



  SaveTermsInDB(result) {
   

    this.configProvider.SaveTermsEntity(result.Terms).subscribe(res =>{
      console.log("**TERMS COMPLETED",res);
      this.SaveShipViasInDB(result);
      this.presentToast("Terms Saved Successfully"+this.appUtils.GetCurrentDateTime());
    },error =>{
      console.log("**INSERTION COMPLETED",error);
    });


  }


  SaveShipViasInDB(result) {

    this.configProvider.UpdateImportEntity(2, 'Masters/2', 1, 'NA', '', '');
     this.configProvider.SaveShipViasEntity(result.ShipVias).subscribe(pos => {
      console.log("**SHIPVIAS COMPLETED",pos);
         this.SaveOrderTagsInDB(result);
         this.presentToast("Ship Via's Saved Successfully"+this.appUtils.GetCurrentDateTime());
       }, error => {
        console.log("SAVE SHIPVIAS ERROR", error);
      });
    
  }

  SaveOrderTagsInDB(result) {
    this.configProvider.UpdateImportEntity(2, 'Masters/3', 1, 'NA', '', '');
   
      this.configProvider.SaveOrderTagsEntity(result.OrderTags).subscribe(pos => {
        console.log("**ORDER TAGS COMPLETED",pos);
        this.presentToast("Order Tags Saved Successfully"+this.appUtils.GetCurrentDateTime());
          this.SyncData2();
          
      }, error => {
        console.log("SAVE Order Tags ERROR", error);
      });
    

  }





  download(Fname, pos, size, backgroundJSON, result, from) {

    return new Promise((resolve) => {

      this.statusLoading = 'Image Downloading' + size;

      //from for Api Or Local 1 = Local , 2 = Api

      const fileUrl = "http://50.63.172.206/Library/Backgrounds/" + Fname;
      console.log("File Url", fileUrl);
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(fileUrl, this.file.dataDirectory + Fname).then((entry) => {
        console.log('download complete: ' + entry.toURL(), pos, size);
        // this.statusLoading = 'Image Downloaded'+pos;
        this.backImagesPath.push(entry.toURL());
        resolve(entry.toURL);
        this.configProvider.UpdateImportEntity(1, 'Background', 2, pos, backgroundJSON, this.appUtils.GetCurrentDateTime());
        this.statusLoading = 'Image Downloading';
        if (pos == size) {

        }


        // this.readFile(entry);
      }, (error) => {
        // handle error
        console.log('download error: ', error);
        resolve(error);
      });
    });
  }


  // DownloadProductImages(Fname , pos , size ) {
  //   this.configProvider.UpdateImportEntity(5 , 'Product Images' ,1 , 'NA' , '' ,this.appUtils.GetCurrentDateTime());

  //   return new Promise((resolve) => {

  //     let folderName = 'Products/';
  //     this.productImagesStatus = 'Downloading Images: '+size;

  //     //from for Api Or Local 1 = Local , 2 = Api

  //     const fileUrl = "http://50.63.172.206/Library/Uploads/WebThumb/"+Fname; 
  //     console.log("File Url" , fileUrl);
  //     const fileTransfer: FileTransferObject = this.transfer.create();
  //     fileTransfer.download(fileUrl, this.file.dataDirectory+folderName+ Fname).then((entry) => {
  //       console.log('download complete: ' + entry.toURL() , pos , size);
  //       this.index = this.index + 1 ;
  //       this.productImagesStatus = 'Image Downloaded'+this.index;
  //       console.log('Index' , this.index);
  //       resolve(entry.toURL);
  //      // this.backImagesPath.push(entry.toURL());
  //       this.configProvider.UpdateImportEntity(5 , 'Product Images' ,2 , pos , '' ,this.appUtils.GetCurrentDateTime());

  //      // this.readFile(entry);
  //     }, (error) => {
  //       // handle error
  //       console.log('**download error: ' , Fname);
  //       this.index = this.index + 1;
  //       resolve(error);
  //     });
  // });



  // }


  DownloadProductImages(Fname, pos, size, response) {
    Fname = encodeURIComponent(Fname.trim())
    const fileUrl = "http://50.63.172.206/Library/Uploads/WebThumb/" + Fname;
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(fileUrl, this.file.dataDirectory + Fname).then((entry) => {
      console.log('download complete: ' + entry.toURL(), pos, size);
      // resolve(entry.toURL);
      this.productImagesStatus = 'Image Downloaded' + this.productIndex;
      this.configProvider.UpdateImportEntity(5, 'Product Images', 2, pos, '', this.appUtils.GetCurrentDateTime());
      // this.checkFile(Fname);
      if (this.productIndex + 1 == size) {
        console.log("**All done");
        this.productImagesStatus = 'Image Download Completed';
        this.configProvider.UpdateImportEntity(5, 'Product Images', "3", 'ALL', '', this.appUtils.GetCurrentDateTime());
       
        this.presentToast("Image Downloading Completed");
       
      } else {
        this.productIndex = this.productIndex + 1;
        console.log("**", this.productIndex / 10 );
        if(this.productIndex % 10 == 0){
          this.presentToast("Image Downloading :- "+this.productIndex+" / "+ size);
        }
         this.DownloadProductImages(response.rows.item(this.productIndex).imagePath, this.productIndex, response.rows.length, response);
      }
      // this.readFile(entry);
    }, (error) => {
      // handle error
      console.log('**download error: ', Fname);
      this.productIndex = this.productIndex + 1;
      this.DownloadProductImages(response.rows.item(this.productIndex).imagePath, this.productIndex, response.rows.length, response);
      // resolve(error);
    });


  }


  public BackgroundImagesDownload(){
    this.backgroundMode.disableWebViewOptimizations();
    console.log("**" , "Background called");
    this.backgroundMode.on("activate").subscribe(()=>{
     // this.nativeAudio.play("audio1");  
     console.log("**" , "Play Background Playing");
    });
    console.log("**" , "Background Playing");
     this.SaveProductsImagesOffline();
  }


  presentToast(ind){
  
    let toast = this.toastctrl.create({
      message: ind,
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {

    });
    toast.present();

  }

  readFile(fileEntry) {
    fileEntry.file(function (file) {
      var reader = new FileReader();

      reader.onloadend = function () {

        console.log("Successful file read: " + this.result);
        // displayFileData(fileEntry.fullPath + ": " + this.result);

      };

      reader.readAsText(file);

    });
  }


}
