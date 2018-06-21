import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { MainHomePage } from '../main-home/main-home';
import { ApiHelperProvider , SessionHelperProvider , ConfigTablesProvider , AppUtilsProvider ,ProductsProvider } from '../../providers/providers';

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
   data = { UserId: 0 , Mode: 0, SubMode: 7, DeviceInfo: 'Test Device', SyncDate:'2010-04-16 14:00:00.000'};
   backImagesPath: any = [];
   statusLoading = 'Loading';
   statusLoading1 = 'In Queue';
   statusLoading2 = 'In Queue';
   productImagesStatus = 'In Queue';
   productIndex = 0 ;

  constructor(public navCtrl: NavController , public ApiHelper: ApiHelperProvider, public loadingCtrl: LoadingController ,
     private transfer: FileTransfer, private file: File ,public sessionHelper: SessionHelperProvider , 
     public configProvider: ConfigTablesProvider, public appUtils: AppUtilsProvider, public productsProvider: ProductsProvider
     ) {
   
    //   this.loading = this.loadingCtrl.create({
    //   content: 'Downloading And Saving Images',
      
    // });
    
   

  }

  ionViewDidLoad() {

   // this.SyncData();
    console.log('ionViewDidLoad SyncDataPage');
  //  this.SaveProductsImagesOffline();
    this.sessionHelper.GetValuesFromSession('SYNCJSON').then((val)=>{
      if(val == null){
        this.SyncData();
       }else{
        console.log("JSON IN SESSION",val);
        this.configProvider.GetAllUnCompleteEntity().subscribe(UnCompletedmilestones =>{
          console.log("Uncomplete Milestones Length",UnCompletedmilestones.length);
          
         if(UnCompletedmilestones == 0){
          console.log("NO Uncomplete Milestones");
          
         }else{
          
         }
        
        },error =>{
          console.log("ERROR" , error);
        });

       }
    }).catch(error =>{
      console.log("API ERROR" , error);
    });

   
    
  }


  SyncData(){
   
    this.sessionHelper.GetValuesFromSession('userid').then((val) =>{
      this.data.UserId = val ; 
      this.data.Mode = 0 ;
      this.data.SubMode = 7 ;
      this.data.DeviceInfo = 'Test Device';
      this.data.SyncDate = '2010-04-16 14:00:00.000';
      this.statusLoading = 'API Running';

      console.log("USER IDD" , this.data.UserId);

     this.ApiHelper.RequestPostHttp(this.data , 'FullSync').subscribe(result => {
      //here you have the analog success function from an ajax call 
      //use the received data
     
      console.log("RESPONSE" , result);
      this.sessionHelper.SaveValueInSession("SYNCJSON" , result);
     

      var promises1 = [];

      for(var i=0 ; i < result.BackgroundPictures.length ; i++){    
        promises1.push(this.download(result.BackgroundPictures[i].picture , i+1 , result.BackgroundPictures.length , result.BackgroundPictures , result , 1));
      }

      Promise.all(promises1)
      .then((results) => {
        console.log("**All Back Images done", results);
        var abc  = this.backImagesPath.join();
        this.sessionHelper.SaveValueInSession('IMAGES' , abc);
        this.configProvider.UpdateImportEntity(1 , 'Background' ,3 , 'ALL' , '' ,this.appUtils.GetCurrentDateTime());
      
        this.SaveTermsInDB(result);
        this.statusLoading = 'Image Downloaded Successfully';
       
      })
      .catch((e) => {
          // Handle errors here
          console.log("ERRORS" , e);
      });

      
       this.statusLoading = 'Got Response';

       
     }, 
      error => {
         //here you have the analog error function from an ajax call 
         //treat the error
         this.statusLoading = 'API Failed';
         console.log("ERROR" , error);
        }
     );

    });
    
    

      

  }

  SyncData2(){
    this.statusLoading = 'Completed';
    this.sessionHelper.GetValuesFromSession('userid').then((val) =>{
      this.data.UserId = val ;
      this.data.Mode = 0 ;
      this.data.SubMode = 5 ;
      this.data.DeviceInfo = 'Test Device';
      this.data.SyncDate = '2010-04-16 14:00:00.000';
      this.statusLoading1 = 'API Running'; 

      this.ApiHelper.RequestPostHttp(this.data , 'FullSync').subscribe(result => {
        //here you have the analog success function from an ajax call 
        //use the received data
        console.log("RESPONSE" , result);
        
        this.sessionHelper.SaveValueInSession("SYNCJSON" , result);
        this.statusLoading1 = 'API Success';
        this.SaveCategoriesInDB(result);
        
  
       }, 
        error => {
           //here you have the analog error function from an ajax call 
           //treat the error
           this.statusLoading1 = 'API Failed';
           console.log("ERROR" , error);
          }
       ); 

    });
   

    

  }


  SaveCategoriesInDB(result){

    this.statusLoading1 = 'Saving Categories';

     for(var i = 0 ; i < result.Categories.length ; i++){
      this.configProvider.SaveCategoryINDB(result.Categories[i] , i+1 , result.Categories.length).subscribe(pos =>{
        console.log("SAVE Categories RES",pos);
     if(pos == result.Categories.length){
        console.log("Category Saved");
        //this.openMainPage();
        this.statusLoading1 = 'Categories Saved';
        this.SaveProductsInDB(result);
     }
     },error =>{
      console.log("SAVE CATEGORIES ERROR",error);
    });
     }

  }

  SaveProductsInDB(result){
    this.statusLoading2 = 'Save Products';

    for(var i = 0 ; i < result.Clothes.length ; i++){
      this.productsProvider.SaveProducts(result.Clothes[i] , i+1 , result.Clothes.length).subscribe(pos =>{
        console.log("SAVE Products RES",pos);
        this.statusLoading2 = 'Products Saved'+pos;
     if(pos == result.Categories.length){
        console.log("Products Completed");
        this.statusLoading2 = 'Products Completed';
        this.SaveProductImages(result); 
     }
     },error =>{
      console.log("SAVE CATEGORIES ERROR",error);
    });
    }

  }


  SaveProductImages(result){
   this.productImagesStatus = 'Saving Product Images';

   for(var i = 0 ; i < result.ClothesImages.length ; i++){
    this.productsProvider.SaveImagesInTable(result.ClothesImages[i] , i+1 , result.ClothesImages.length).subscribe(pos =>{
      console.log("SAVE Products Images RES",pos);
      this.productImagesStatus = 'Saving Product Images'+pos; 
     if(pos == result.Categories.length){
      console.log("Products Images Completed");
      this.productImagesStatus = 'Product Images Completed';
      this.SaveProductsImagesOffline();   
     }
   },error =>{
    console.log("SAVE CATEGORIES ERROR",error);
  });
  }

  }

  SaveProductsImagesOffline(){
    this.productImagesStatus = 'Saving Images Offline';
    this.productsProvider.GetAllImagesFromDB().subscribe(res =>{
      console.log("Products Images Length",res.rows.length);
     if(res.rows.length == 0){
      console.log("**NO Products Images Found" , "");
     }else{

      // var promises = [];

      //  for(var i = 0 ; i < res.rows.length ; i++){
      //    console.log("Image Name" , res.rows.item(i).imagePath);
      //    promises.push(this.DownloadProductImages(res.rows.item(i).imagePath , i+1 ,res.rows.length));
      //  }

      //  Promise.all(promises)
      //  .then((results) => {
      //    console.log("**All done", results);
      //    this.configProvider.UpdateImportEntity(5 , 'Product Images' ,3 , 'ALL' , '' ,this.appUtils.GetCurrentDateTime());
      //    this.openMainPage(); 
      //  })
      //  .catch((e) => {
      //      // Handle errors here
      //      console.log("ERRORS" , e);
      //  });

      this.DownloadProductImages(res.rows.item(this.productIndex).imagePath , this.productIndex ,res.rows.length , res);
      

     }
    
    },error =>{
      console.log("ERROR" , error);
    });

  }



  openMainPage(){
    this.navCtrl.push(MainHomePage); 
  }



   SaveTermsInDB(result){
    this.statusLoading = 'Saving Terms';
    for(var i = 0 ; i < result.Terms.length ; i++){
      this.configProvider.SaveTermsEntity(result.Terms[i] , i+1 , result.Terms.length).subscribe(pos =>{
          console.log("SAVE TERMS RES",pos);
       if(pos == result.Terms.length){
        this.statusLoading = 'Terms Saved';
        this.SaveShipViasInDB(result);

       }
       },error =>{
        console.log("SAVE TERMS ERROR",error);
      });
     }

     

   }


   SaveShipViasInDB(result){
    this.statusLoading = 'Saving ShipVias';
    this.configProvider.UpdateImportEntity(2 , 'Masters/2' , 1 , 'NA' , '' ,'');

    for(var i = 0 ; i < result.ShipVias.length ; i++){
      this.configProvider.SaveShipViasEntity(result.ShipVias[i] , i+1 , result.ShipVias.length).subscribe(pos =>{
        console.log("SAVE SHIPVIAS RES",pos);
      if(pos == result.Terms.length){
        this.statusLoading = 'ShipVias Saved';
        this.SaveOrderTagsInDB(result);
     
     }
     },error =>{
      console.log("SAVE SHIPVIAS ERROR",error);
    });
    }


   }

   SaveOrderTagsInDB(result){
    this.statusLoading = 'Saving Order Tags';
    this.configProvider.UpdateImportEntity(2 , 'Masters/3' , 1 , 'NA' , '' ,'');
    for(var i = 0 ; i < result.OrderTags.length ; i++){
      this.configProvider.SaveOrderTagsEntity(result.OrderTags[i] , i+1 , result.OrderTags.length).subscribe(pos =>{
        console.log("SAVE Order Tags RES",pos);
      if(pos == result.OrderTags.length){
        this.statusLoading = 'Order Tags Saved';
        console.log("ALL CONFIG TABLES SAVED");
        this.SyncData2();
     
     }
     },error =>{
      console.log("SAVE Order Tags ERROR",error);
    });
    }

   }





  download(Fname , pos , size , backgroundJSON , result , from) {

    return new Promise((resolve) => {

    this.statusLoading = 'Image Downloading'+size;

    //from for Api Or Local 1 = Local , 2 = Api
    
    const fileUrl = "http://50.63.172.206/Library/Backgrounds/"+Fname; 
    console.log("File Url" , fileUrl);
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(fileUrl, this.file.dataDirectory + Fname).then((entry) => {
      console.log('download complete: ' + entry.toURL() , pos , size);
     // this.statusLoading = 'Image Downloaded'+pos;
      this.backImagesPath.push(Fname);
      resolve(entry.toURL);
      this.configProvider.UpdateImportEntity(1 , 'Background' ,2 , pos ,backgroundJSON ,this.appUtils.GetCurrentDateTime());
      this.statusLoading = 'Image Downloading';
      if(pos == size){
      
      }
      
      
     // this.readFile(entry);
    }, (error) => {
      // handle error
      console.log('download error: ' , error);
      resolve(error);
    });
  });
  }


  DownloadProductImages(Fname , pos , size , response) {
 
   // return new Promise((resolve) => {
      
     // let folderName = 'Products/';
     // this.statusLoading = 'Image Downloading'+size;
  
      //from for Api Or Local 1 = Local , 2 = Api
      
      const fileUrl = "http://50.63.172.206/Library/Uploads/WebThumb/"+Fname; 
      console.log("File Url" , fileUrl);
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(fileUrl, this.file.dataDirectory + Fname).then((entry) => {
        console.log('download complete: ' + entry.toURL() , pos , size);
        
       // resolve(entry.toURL);
        this.productImagesStatus = 'Image Downloaded'+this.productIndex;
        this.configProvider.UpdateImportEntity(5 , 'Product Images' ,2 , pos , '' ,this.appUtils.GetCurrentDateTime());
        this.checkFile(Fname);
        if(this.productIndex + 1 == size){
          console.log("**All done");
         this.productImagesStatus = 'Image Download Completed';
         this.configProvider.UpdateImportEntity(5 , 'Product Images' ,3 , 'ALL' , '' ,this.appUtils.GetCurrentDateTime());
            this.openMainPage(); 
        }else{
          this.productIndex = this.productIndex + 1 ;
          this.DownloadProductImages(response.rows.item(this.productIndex).imagePath , this.productIndex ,response.rows.length , response);
        }
        
        
       // this.readFile(entry);
      }, (error) => {
        // handle error
        console.log('**download error: ' , Fname);
        this.productIndex = this.productIndex + 1 ;
        this.DownloadProductImages(response.rows.item(this.productIndex).imagePath , this.productIndex ,response.rows.length , response);
       // resolve(error);
      });
  //});

  }


  checkFile(path: string){
    console.log("**Image PATH" , path);
    this.file.checkFile(this.file.dataDirectory, path)
    .then(() => {
      // exist.
      console.log("exist!!!");  // I always enter here
    })
    .catch((err) => {
      // try again
      console.log("ERR : " + err);
    });
  }



}
