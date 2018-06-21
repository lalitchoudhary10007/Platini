import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {  IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ConfigTablesProvider, ProductsProvider , AppUtilsProvider } from '../../providers/providers';
import { File } from '@ionic-native/file';
import { normalizeURL } from 'ionic-angular';

import * as $ from "jquery";
/**
 * Generated class for the ProductListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-product-listing',
  templateUrl: 'product-listing.html',
})
@NgModule({
  imports: [IonicPageModule]
})
export class ProductListingPage {
  ThirdLevelCategories: any = [];
  AllProducts: any = [];
  ProductImages: any = [];
  catids: any = [];
  catType = 0 ;
  Clearance = 0 ;
  page = 0;
  perPage = 24;
  totalData = 0;
  totalPage = 0;
  ScreenHeaders: any = [];
  hideMe = true ;

  // Property used to store the callback of the event handler to unsubscribe to it when leaving this page
  //public unregisterBackButtonAction: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,private file: File,
    public productsProvider: ProductsProvider, public configProvider: ConfigTablesProvider,
    public appUtils : AppUtilsProvider,  public platform: Platform) {

  }





  ionViewDidLoad() {

    console.log('ionViewDidLoad ProductListingPage');
   
   // this.initializeBackButtonCustomHandler();
    $(document).ready(function () {
      $(".filter > a").hover(function () {
        $(".filter > a + ul").show();
      });
      $(".as-hvr li a").click(function () {
        $(".as-hvr li a").removeClass('ctive');
        $(this).addClass('ctive');
      });
    });

  
   // this.twoDecimals(50);
   

  }

  ionViewWillEnter(){

    if(this.navParams.get("Type")== 1){
      this.hideMe = false ;
      this.catType = 1 ;
      this.Clearance = 1 ;
      this.ScreenHeaders = [];
      this.AddScreenHeader("home" , "Home" , "");
      this.AddScreenHeader(this.navParams.get("ParentCat"),"ParentCat" , this.navParams.get("ParentId"));
      this.GetClearanceProducts();
    }else if(this.navParams.get("Type")== 2){
      this.hideMe = false ;
      this.catType = 2 ;
      this.Clearance = 0 ;
      this.ScreenHeaders = [];
      this.AddScreenHeader("home" , "Home" , "");
      this.AddScreenHeader(this.navParams.get("ParentCat"),"ParentCat" , this.navParams.get("ParentId"));
      this.GetFutureDeliveriesProducts();
    }
    else{
      this.hideMe = true ;
      this.catType = 0 ;
      this.Clearance = 0 ;
      this.ScreenHeaders = [];
      this.AddScreenHeader("home" , "Home" , "");
      this.AddScreenHeader(this.navParams.get("ParentCat"),"ParentCat" , this.navParams.get("ParentId"));
      this.AddScreenHeader(this.navParams.get("CatName"),"ProductListing" , this.navParams.get("CatID"));
      this.GetThirdLevelCategories(this.navParams.get("CatID"));

    }

   
  }


  AddScreenHeader(title , type , typeid){

    this.ScreenHeaders.push({
      header_title:title,
      header_type:type,
      header_type_id:typeid
    });

   }




  GetThirdLevelCategories(id) {

    this.ThirdLevelCategories = [];
    this.configProvider.GetThirdLevelCategories(id).subscribe(res => {

      if (res.rows.length == 0) {
        console.log("NO Categories Found");

      } else {
        for (var i = 0; i < res.rows.length; i++) {

          this.catids.push(res.rows.item(i).categoryId);
          this.ThirdLevelCategories.push({
            id: res.rows.item(i).categoryId,
            name: res.rows.item(i).name,
            sort_order: res.rows.item(i).sortOrder,
            parentId: res.rows.item(i).parentId,
            isActive: res.rows.item(i).isActive,
            isDelete: res.rows.item(i).isDelete,
            CategoryLevel: res.rows.item(i).CategoryLevel,
            dateCreated: res.rows.item(i).dateCreated,
            dateUpdated: res.rows.item(i).dateUpdated
          })


        }


        this.productsProvider.GetThirdLevelProductCount(this.catids, this.Clearance).subscribe(count => {
          this.totalData = count;
          console.log("Total Data", this.totalData, "Count", count);
          if (this.totalData == 0) {
            console.log("No Product Found");
          } else {
            let total = Math.floor(this.totalData / this.perPage);
            let mod = this.totalData % this.perPage;
            if (mod == 0) {
              this.totalPage = total;
            } else {
              this.totalPage = total + 1;
            }
            console.log("Total Data:-", this.totalData, "Total Page:-", total, "MODULAS:-", mod, "Final Total page:-", this.totalPage);
            this.GetAllProducts(this.catids, this.perPage * this.page, this.perPage);

          }
        }, error => {
          console.log("ERROR", error);
        });

      }

    }, error => {
      console.log("ERROR", error);
    });

  }


  GetClearanceProducts(){

    this.productsProvider.GetClearanceProductCount().subscribe(count => {
      this.totalData = count;
      console.log("Total Data", this.totalData, "Count", count);
      if (this.totalData == 0) {
        console.log("No Product Found");
      } else {
        let total = Math.floor(this.totalData / this.perPage);
        let mod = this.totalData % this.perPage;
        if (mod == 0) {
          this.totalPage = total;
        } else {
          this.totalPage = total + 1;
        }
        console.log("Total Data:-", this.totalData, "Total Page:-", total, "MODULAS:-", mod, "Final Total page:-", this.totalPage);
        this.GetAllProducts(this.catids, this.perPage * this.page, this.perPage );

      }
    }, error => {
      console.log("ERROR", error);
    });
 
    
  }

  GetFutureDeliveriesProducts(){

    this.productsProvider.GetFutureDeliveriesProductCount().subscribe(count => {
      this.totalData = count;
      console.log("Total Data", this.totalData, "Count", count);
      if (this.totalData == 0) {
        console.log("No Product Found");
      } else {
        let total = Math.floor(this.totalData / this.perPage);
        let mod = this.totalData % this.perPage;
        if (mod == 0) {
          this.totalPage = total;
        } else {
          this.totalPage = total + 1;
        }
        console.log("Total Data:-", this.totalData, "Total Page:-", total, "MODULAS:-", mod, "Final Total page:-", this.totalPage);
        this.GetAllProducts(this.catids, this.perPage * this.page, this.perPage );

      }
    }, error => {
      console.log("ERROR", error);
    });
 
    
  }



  GetAllProducts(catids, startpageIndex, perpage) {

    console.log("SELECTED CAT ID", catids);
    this.productsProvider.GetThirdLevelProducts(catids, startpageIndex, perpage , this.catType , this.Clearance).subscribe(res1 => {
      console.log("**ThirdLevel PRODUCTS length", res1.rows.length);
      this.AllProducts = [];
      for (var i = 0; i < res1.rows.length; i++) {

        let temp = res1.rows.item(i);
        let imgepath = '';
        this.productsProvider.GetBaseImageOfproduct(res1.rows.item(i).clothesId).subscribe(res => {
          //   console.log("PRODUCTS IMAGES" , temp.styleNumber, "Images" ,res);
          if (res.rows.length == 0) {

            imgepath = 'no_image';

          }
          else {
           
            var imagePath1 = this.file.dataDirectory + res.rows.item(0).imagePath;
            imgepath = normalizeURL(imagePath1);
            this.checkFile(res.rows.item(0).imagePath);

          }
        //  console.log("**Product Future Date" , temp.futureDeliveryDate);
          if (temp.DiscountedPrice == null) {                                           //    file:///var/mobile/Containers/Data/Application/8F393B99-A6E2-442E-B6FC-2744BB1E505F/Library/NoCloud/    
            this.AllProducts.push({ style: temp.styleNumber, price: temp.price, Discount: '', img:  imgepath,
              futureDelivery: temp.futureDeliveryDate});

          } else {
            this.AllProducts.push({ style: temp.styleNumber, price: temp.DiscountedPrice, Discount: temp.price, img:  imgepath,
            futureDelivery: temp.futureDeliveryDate});
          }
           

        }, error => {
          console.log("ERROR", error);
        });

      }

    }, error => {
      console.log("ERROR", error);
    });


  }


  doInfinite(infiniteScroll) {
    console.log("Infinite Scroll", infiniteScroll);
    this.page = this.page + 1;
    console.log("Page", this.page, "start index", this.perPage * this.page);

    setTimeout(() => {

      this.productsProvider.GetThirdLevelProducts(this.catids, this.perPage * this.page, this.perPage, this.catType , this.Clearance).subscribe(res1 => {
        console.log("**ThirdLevel PRODUCTS length", res1.rows.length);

        for (var i = 0; i < res1.rows.length; i++) {
          let temp = res1.rows.item(i);
          let imgepath = '';
          this.productsProvider.GetBaseImageOfproduct(res1.rows.item(i).clothesId).subscribe(res => {
            //  console.log("PRODUCTS IMAGES" , temp.styleNumber, "Images" ,res);
            if (res.rows.length == 0) {
              imgepath = 'no_image';
            }
            else {
            
            var imagePath1 = this.file.dataDirectory + res.rows.item(0).imagePath;
            imgepath = normalizeURL(imagePath1);
            this.checkFile(res.rows.item(0).imagePath);
            }
            if (temp.DiscountedPrice == null) {
              this.AllProducts.push({ categoryId: temp.categoryId, style: temp.styleNumber, price: temp.price, Discount: '', img: imgepath });

            } else {
              this.AllProducts.push({ categoryId: temp.categoryId, style: temp.styleNumber, price: temp.DiscountedPrice, Discount: temp.price, img: imgepath });
            }
            //  console.log("**Product Data" , this.AllProducts);

          }, error => {
            console.log("ERROR", error);
          });

        }

      }, error => {
        console.log("ERROR", error);
      });

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 100);

  }



  onFilter(category: any): void {
    console.log('onFilter');
    $(".as-hvr").hide();
    console.log("category id", category);
    this.catids = [];
    this.catids.push(category);
    this.productsProvider.GetThirdLevelProductCount(this.catids , this.Clearance).subscribe(count => {
      this.totalData = count;
      console.log("Total Data", this.totalData, "Count", count);
      if (this.totalData == 0) {
        console.log("No Product Found");
      } else {

        let total = Math.floor(this.totalData / this.perPage);
        let mod = this.totalData % this.perPage;
        if (mod == 0) {
          this.totalPage = total;
        } else {
          this.totalPage = total + 1;
        }
        this.page = 0 ;

        console.log("Total Data:-", this.totalData, "Total Page:-", total, "MODULAS:-", mod, "Final Total page:-", this.totalPage);
        this.GetAllProducts(this.catids, this.perPage * this.page, this.perPage);

      }
    }, error => {
      console.log("ERROR", error);
    });

  }


  OpenProductDetails(prodID){

   console.log("Product Id" , prodID);

  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
   // this.unregisterBackButtonAction && this.unregisterBackButtonAction();
}


  // initializeBackButtonCustomHandler(): void {
	// 	this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
  //     console.log('Prevent Back Button Page Change');
  //     if(this.navCtrl.canGoBack()){
  //       this.nav.pop();
  //     }else{

  //     }


	// 	}, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
  //   }  


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
