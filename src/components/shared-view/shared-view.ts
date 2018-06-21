import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductListingPage } from '../../pages/product-listing/product-listing'
import { SessionHelperProvider , ConfigTablesProvider, AppUtilsProvider } from '../../providers/providers';
import * as $ from "jquery";
/**
 * Generated class for the SharedViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'shared-view',
  templateUrl: 'shared-view.html'
})
export class SharedViewComponent {

  text: string;
  parent_cat: string ;
  parent_cat_id: any ;
  FirstLevelCategories: any = [];
  SecondLevelCategories: any = [];

  constructor(public sessionProvider: SessionHelperProvider , public configProvider: ConfigTablesProvider, 
    public navCtrl: NavController , public appUtils: AppUtilsProvider) {
    console.log('Hello SharedViewComponent Component');
    this.text = 'Hello World';

      this.configProvider.GetFirstLevelCategories().subscribe(res =>{
        console.log("GetFirstLevelCategories Length",res);
        
       if(res.rows.length == 0){
        console.log("NO Categories Found");
        
       }else{
        for(var i = 0; i < res.rows.length; i++) {
            
          this.FirstLevelCategories.push({id:res.rows.item(i).categoryId,
            name:res.rows.item(i).name,
            sort_order:res.rows.item(i).sortOrder,
            parentId:res.rows.item(i).parentId,
            isActive:res.rows.item(i).isActive,
            isDelete:res.rows.item(i).isDelete,
            CategoryLevel:res.rows.item(i).CategoryLevel,
            dateCreated:res.rows.item(i).dateCreated,
            dateUpdated:res.rows.item(i).dateUpdated})
  
        }
  
        this.FirstLevelCategories.push({id:'1A',
        name:'NEW ARRIVALS',
        sort_order:'NA',
        parentId:'NA',
        isActive:'NA',
        isDelete:'NA',
        CategoryLevel:'NA',
        dateCreated:'NA',
        dateUpdated:'NA'});
  
        this.FirstLevelCategories.push({id:'1B',
        name:'CLEARANCE',
        sort_order:'NA',
        parentId:'NA',
        isActive:'NA',
        isDelete:'NA',
        CategoryLevel:'NA',
        dateCreated:'NA',
        dateUpdated:'NA'});
  
        this.sessionProvider.GetValuesFromSession('roleid').then((val)=>{
          
          if(val == 1){
            this.FirstLevelCategories.push({id:'1C',
              name:'Future Deliveries',
              sort_order:'NA',
              parentId:'NA',
              isActive:'NA',
              isDelete:'NA',
              CategoryLevel:'NA',
              dateCreated:'NA',
              dateUpdated:'NA'});
              this.FirstLevelCategories.push({id:'1D',
              name:'Deactivated',
              sort_order:'NA',
              parentId:'NA',
              isActive:'NA',
              isDelete:'NA',
              CategoryLevel:'NA',
              dateCreated:'NA',
              dateUpdated:'NA'});
          }
     
         }).catch(error =>{
           console.log("API ERROR" , error);
         });
  
  
       }
      
      },error =>{
        console.log("ERROR" , error);
      });



  }



  ionViewDidLoad(){


  }



  openCatalogue(){

    console.log("OPEN CATALOGUE");
    $(".catalog").addClass("show-left");
    $(".left-container").show();  

  }

  openLogin(){
    $(".button-as").addClass("show-left");
  }

  openSearch(){
    $(".search-area").addClass('search-visible');
  }

  closeMenu(){
    console.log('closeMenu');
    $(".left-container").removeClass('show-left');
    $(".search-area").removeClass('search-visible');
  }
  loginshow(){
    console.log('loginshow');
    $(".left-container").removeClass('show-left');
    $(".login-as").addClass("show-left");
  }


  registration(){
    console.log('registration');
    $(".left-container").removeClass('show-left');
    $(".registration").addClass("show-left");

  }
  
  forgotid(){
    console.log('forgotid');
    $(".left-container").removeClass('show-left');
    $(".forgot-as").addClass("show-left");
  }
  
  registerwholeseler(){
    console.log('registerwholeseler');
    $(".left-container").removeClass('show-left');
    $(".registration").addClass("show-left");
  }

  loginidexist(){
    console.log('loginidexist');
    $(".left-container").removeClass('show-left');
    $(".login-as").addClass("show-left");
  }

  


  





  GetSecondLevelCategories(id , name){
    $("#maincat ul").hide();
    this.parent_cat = name ;
    this.parent_cat_id = id ;
    console.log("CLICKED IDD" , id)
    if(id == '1A'){
     console.log('NEW ARRIVALS CLICKED');
    }else if(id == '1B'){
     console.log('CLEARANCE CLICKED');
     this.OpenProductListing(id , name , 1);
    }else if(id == '1C'){
     console.log('FUTURE DELIVERIES CLICKED');
     this.OpenProductListing(id , name , 2);
    }else if(id == '1D'){
     console.log('DEACTIVATED CLICKED');
    }else{
      
      
      this.SecondLevelCategories = [];
      this.configProvider.GetSecondLevelCategories(id).subscribe(res =>{
       console.log("Second Level Length",res);
       
      if(res.rows.length == 0){
       console.log("NO Categories Found");
       
      }else{
       for(var i = 0; i < res.rows.length; i++) {
           
         this.SecondLevelCategories.push({id:res.rows.item(i).categoryId,
           name:res.rows.item(i).name,
           sort_order:res.rows.item(i).sortOrder,
           parentId:res.rows.item(i).parentId,
           isActive:res.rows.item(i).isActive,
           isDelete:res.rows.item(i).isDelete,
           CategoryLevel:res.rows.item(i).CategoryLevel,
           dateCreated:res.rows.item(i).dateCreated,
           dateUpdated:res.rows.item(i).dateUpdated})
 
       }
       $("#maincat ul").show();
      }
     
     },error =>{
       console.log("ERROR" , error);
     });
 
   }
 
    }

    OpenProductListing(catID , name , type){
      
      this.navCtrl.push(ProductListingPage , {Type: type ,
        CatID: catID , CatName:name , ParentId: this.parent_cat_id , ParentCat: this.parent_cat
        
      }); 
      $(".left-container").hide(300);  
  
    }


   

  

}
