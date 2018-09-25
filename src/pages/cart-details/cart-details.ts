import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ConfigTablesProvider, ProductsProvider, AppUtilsProvider, SessionHelperProvider } from '../../providers/providers';


/**
 * Generated class for the CartDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart-details',
  templateUrl: 'cart-details.html',
})
export class CartDetailsPage {

  cartJSON: any;
  cartItems: any = [] ;
  cart_cloth_details: any  = [] ;
  qty = 0  ; amt = 0 ;
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public productsProvider: ProductsProvider, public appUtils: AppUtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartDetailsPage');
    this.GetProductsOfCart();
  }


  GetProductsOfCart() {


    this.productsProvider.GetAllFromCart().subscribe(res => {
      if (res.rows.length == 0) {
        console.log("No Products In Cart");
      }
      else {

        for (var i = 0; i < res.rows.length; i++) {
          console.log("**CART DETAILS RES", res.rows.item(i));
          this.cartItems.push(res.rows.item(i));
          console.log("**CART ITEMS " ,res.rows.item(i).cartData);
          this.cartJSON = JSON.parse(res.rows.item(i).cartData);
          console.log("**CART JSON " , this.cartJSON);
          var img ;
          if(this.cartJSON.product_images.length == 0){
            img = "" ;
          }else{
            img = this.cartJSON.product_images[0].path ;
          }
          console.log("sss" , img);
          var price ;
          if (this.cartJSON.product_details.DiscountedPrice == null) {
              price = this.cartJSON.product_details.price;
          } else {
              price= this.cartJSON.product_details.DiscountedPrice;
          //  this.product_details.DiscountedPrice = res.rows.item(0).price;
          }
          console.log("FITSS JSON " , this.cartJSON.cart_data);

          this.cart_cloth_details.push({
             id: res.rows.item(i).clothesId,
             style: this.cartJSON.product_details.styleNumber,
             qty: this.cartJSON.total_qty,
             total_pr: this.cartJSON.total_price,
             per_price: price ,
             img_path: img,
             Fits: this.cartJSON.cart_data,
          });

        }
        console.log("**" , this.cart_cloth_details);
       
        this.GetFinalTotalAndAmount();

      }

    }, error => {
      console.log("ERROR", error);
    });

  }


  GetFinalTotalAndAmount(){
     
    this.qty = 0 , this.amt = 0 ;

     for(var i = 0 ; i < this.cart_cloth_details.length ; i++){
         this.qty = this.qty + this.cart_cloth_details[i].qty ;
         this.amt = this.amt + this.cart_cloth_details[i].total_pr
     }
      console.log("Final Amount And Qty" , this.qty , this.amt);

  }


  change(value: any, maxqty: number, ind: any, parentInd: any, size: any, from: any , clothIndex:any,fitsIndex:any) {
    console.log("Changed Value", value, maxqty);
    console.log("cloth Index", clothIndex , fitsIndex);
    if(value == ''){
      console.log("Value Empty");
    }else{
      if (value > maxqty) {
        if (from == 1) {
         size.cartQty = 0 ;   
         this.UpdateTotalQtyAmount(clothIndex,fitsIndex);
        } else {
        size.groupQty = 0
          this.UpdateTotalQtyAmount(clothIndex,fitsIndex);
        }
        this.presentBasicAlert("Alert", "You cannot order more than " + maxqty + " quantity for this size");
     
      } else {
        console.log("** CLOTH ID",this.cart_cloth_details[clothIndex].id);
        let selectedfit = this.cartItems.find(item => item.clothesId === this.cart_cloth_details[clothIndex].id);
        console.log("**OLD JSON" , JSON.parse(selectedfit.cartData));
        selectedfit.cartData.cart_data = this.cart_cloth_details[clothIndex].Fits ;
        console.log("**NEW JSON" , this.cart_cloth_details[clothIndex].Fits);
        console.log("**AFTER UPDATE" , selectedfit.cartData);
        // this.productsProvider.SaveIntoCart(this.product_id , cartJson).subscribe(rs => {
        //   // this.events.publish('user:created', rs, Date.now());
        //    this.GetScales();
        //    this.presentBasicAlert("Success" , "Product added to cart successfully");
        //  },error =>{
        //    console.log("SOMETHING WRONG WITH ADD TO CART");
        //  });

        if (from == 1) {
         let upd  = maxqty - value ;
         console.log("**REMAINING STOCK" , upd);
         this.productsProvider.UpdateStockScale(size.sizeDetails.clothesScaleId, upd);
         this.UpdateTotalQtyAmount(clothIndex,fitsIndex);
         } else {
          let upd = maxqty - value ;
          console.log("**REMAINING STOCK" , upd);
          this.productsProvider.UpdateStockScale(size.scale.clothesScaleId, upd);
          this.UpdateTotalQtyAmount(clothIndex,fitsIndex);
        }

      }
    }

  }

  UpdateTotalQtyAmount(ind : any , fitIndex:any){
    console.log("cart Cloth" , this.cart_cloth_details[ind].Fits[fitIndex]);
    var total = 0;
          for(var i = 0 ; i < this.cart_cloth_details[ind].Fits.length ; i++){
            for(var m = 0 ; m < this.cart_cloth_details[ind].Fits[i].OpenScales.length ; m++){
              console.log("Open Scales" , this.cart_cloth_details[ind].Fits[i].OpenScales);
              for (var k = 0; k < this.cart_cloth_details[ind].Fits[i].OpenScales[m].Allsizes.length; k++) {
                var cart = this.cart_cloth_details[ind].Fits[i].OpenScales[m].Allsizes[k].cartQty;
                console.log("Added Into Cart" , cart);
                if (cart === "") {
                  cart = 0;
                } else {
                  cart = this.cart_cloth_details[ind].Fits[i].OpenScales[m].Allsizes[k].cartQty;
                }
                var integer_qty = parseInt(cart, 10);
                total = total + integer_qty;
              }

            }

            for (var l = 0; l < this.cart_cloth_details[ind].Fits[i].GroupScales.length; l++) {
              var gtotal = 0;
              for (var k = 0; k < this.cart_cloth_details[ind].Fits[i].GroupScales[l].Allsizes.length; k++) {
                var gcart = this.cart_cloth_details[ind].Fits[i].GroupScales[l].Allsizes[k].sizeDetails.quantity;
                gtotal = gtotal + gcart;
              }
              var gr = this.cart_cloth_details[ind].Fits[i].GroupScales[l].groupQty;
              if (gr === "") {
                gr = 0
              } else {
                let max = this.cart_cloth_details[ind].Fits[i].GroupScales[l].scale.invQty;
              }
              var groupTotal = gr * gtotal;
              total = total + groupTotal;
      
            }
          }


          console.log("TOTAL QTY", total);
          console.log("PRICE", this.cart_cloth_details[ind].per_price * total);
          this.cart_cloth_details[ind].total_pr = this.cart_cloth_details[ind].per_price * total ;
          this.cart_cloth_details[ind].qty = total ;
          
          this.GetFinalTotalAndAmount();

  }



  presentBasicAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }


  BreakPacket(clothIndex: any , fitsIndex: any, groupIndex: any, groupScale: any) {

    for (var i = 0; i < this.cart_cloth_details[clothIndex].Fits[fitsIndex].OpenScales[groupIndex].Allsizes.length; i++) {
      var first = this.cart_cloth_details[clothIndex].Fits[fitsIndex].OpenScales[groupIndex].Allsizes[i].sizeDetails.quantity;
      var s = groupScale.Allsizes[i].sizeDetails.quantity;
      var t = s + first;
      this.cart_cloth_details[clothIndex].Fits[fitsIndex].OpenScales[groupIndex].Allsizes[i].sizeDetails.quantity = t;
    }

  }

  public selectAll(event): void {
    event.target.select();
}

  hidepop() {
    document.getElementById('pop-size').style.display = 'none';
  }

  showSize() {
    document.getElementById('pop-size').style.display = 'block';
  }

  editcustoers1() {
    document.getElementById('editcustoers').style.display = 'block';
  }
  closeEditcustmers1() {
    document.getElementById('editcustoers').style.display = 'none';
  }

  cartSearchShow() {
    document.getElementById('crt-search').style.display = 'block';
  }

  closecartSearch() {
    document.getElementById('crt-search').style.display = 'none';
  }
  openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    var d = document.getElementById(cityName);
    d.className += " active";
  }


}
