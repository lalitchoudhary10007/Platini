import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Observable } from 'rxjs/Observable';
import { AppUtilsProvider } from '../../providers/app-utils/app-utils'
import { ConfigTablesProvider } from '../../providers/config-tables/config-tables'

/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductsProvider {

  constructor(public sqlite: SQLite,  public appUtils: AppUtilsProvider , public configProvider: ConfigTablesProvider) {
    console.log('Hello ProductsProvider Provider');
  }

  CreateProductsTables(){

    this.CreateProductsTable();
    this.CreateProductImagesTable();

  }



  CreateProductsTable(){

    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    })
    .then((db: SQLiteObject) =>{
     db.executeSql('CREATE TABLE IF NOT EXISTS Products(clothesId INTEGER, styleNumber TEXT, price INTEGER, clothesDescription TEXT, tags TEXT, categoryId INTEGER, isActive TEXT , clearance INTEGER, brandId INTEGER, sortOrder INTEGER, sizeGroupId INTEGER, productCost INTEGER, originalQty INTEGER, msrp INTEGER, isDelete TEXT, adjustQty INTEGER, dateChanged TEXT, dateCreated TEXT, dateUpdated TEXT, DiscountedPrice INTEGER, DiscountedMSRP INTEGER, futureDeliveryDate TEXT)', {})
     .then(res => console.log('PRODUCTS ENTITY CREATED'))
     .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  }

  SaveProducts(data , pos , length){

    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO Products VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[data.clothesId,data.styleNumber,data.price,data.clothesDescription,data.tags,data.categoryId,
          data.isActive,data.clearance,data.brandId,data.sortOrder,data.sizeGroupId,data.productCost,
          data.originalQty,data.msrp,data.isDelete,data.adjustQty,data.dateChanged,data.dateCreated,
          data.dateUpdated,data.DiscountedPrice,data.DiscountedMSRP, data.futureDeliveryDate])
          .then(res => {
            console.log("SAVED" , res);
            if(pos == length){
              this.configProvider.UpdateImportEntity(4 , 'Products' , 3 , 'ALL' , '' , this.appUtils.GetCurrentDateTime());
              observer.next(pos);
              }else{
              this.configProvider.UpdateImportEntity(4 , 'Products', 2 , pos , '' , this.appUtils.GetCurrentDateTime());
              observer.next(pos);
              }
          })
          .catch(e => {
            console.log(e);
           });
        }).catch(e => {
        console.log(e);
        
      });
    },);


  }

  CreateProductImagesTable(){

    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    })
    .then((db: SQLiteObject) =>{
     db.executeSql('CREATE TABLE IF NOT EXISTS ProductImages(clothesImageId INTEGER, clothesId INTEGER, imageName TEXT, imagePath TEXT, isActive boolean, isDelete BOOLEAN, sortOrder INTEGER , dateCreated TEXT, dateUpdated TEXT)', {})
     .then(res => console.log('PRODUCT IMAGES ENTITY CREATED'))
     .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  }

  SaveImagesInTable(data, pos, length){

    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO ProductImages VALUES(?,?,?,?,?,?,?,?,?)',[data.clothesImageId,data.clothesId,data.imageName,data.imagePath,data.isActive,data.isDelete,
          data.sortOrder,data.dateCreated,data.dateUpdated])
          .then(res => {
            console.log("SAVED" , res);
            if(pos == length){
              this.configProvider.UpdateImportEntity(5 , 'Product Images' , 3 , 'ALL' , '' , this.appUtils.GetCurrentDateTime());
              observer.next(pos);
              }else{
              this.configProvider.UpdateImportEntity(5 , 'Product Images', 2 , pos , '' , this.appUtils.GetCurrentDateTime());
              observer.next(pos);
              }
          })
          .catch(e => {
            console.log(e);
           });
        }).catch(e => {
        console.log(e);
        
      });
    },);


  }

  GetAllProductsOfCategory(catid){

   return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM Products WHERE categoryId=? ORDER BY dateCreated ASC', [catid])
      .then(res => {
        observer.next(res);
    })
      .catch(e => {
        observer.next(e);
        console.log(e);
      });
        
    });
  
     },);

  }

 


  GetThirdLevelProducts(catid, startpage , limit,typeCat , clearance){
    let query = '';
    if(typeCat == 1){
      query = 'SELECT * FROM Products WHERE clearance=? ORDER BY dateCreated DESC LIMIT '+startpage+','+limit;

    }else if(typeCat == 2){
      query = 'SELECT * FROM Products WHERE clearance=? AND futureDeliveryDate not null ORDER BY dateCreated DESC LIMIT '+startpage+','+limit;

    }
    else{
      let abc = catid.join();
      query = 'SELECT * FROM Products WHERE clearance=? AND categoryId IN('+abc+') ORDER BY dateCreated DESC LIMIT '+startpage+','+limit;
    
    }

     console.log("QUERY PRODUCTS" , query);
    return Observable.create(observer => {
       this.sqlite.create({
         name: 'Platini.db',
         location: 'default'
       }).then((db: SQLiteObject) => {
         db.executeSql(query, [clearance])
       .then(res => {
         observer.next(res);
     })
       .catch(e => {
         observer.next(e);
         console.log(e);
       });
         
     });
   
      },);
 
   }

   GetThirdLevelProductCount(catid , clearance){
    let abc = catid.join();
    let query = 'SELECT COUNT(*) AS total FROM Products WHERE clearance=? AND categoryId IN('+abc+')';
    console.log("QUERY" , query);
    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(query, [clearance])
      .then(res => {
      //  console.log("Total" , res.rows.item(0).total);
        observer.next(res.rows.item(0).total);
    })
      .catch(e => {
        observer.next(0);
        console.log(e);
      });
        
    });
  
     },);

   }

   GetClearanceProductCount(){
    let query = 'SELECT COUNT(*) AS total FROM Products WHERE clearance=?';
    console.log("QUERY" , query);
    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(query, [1])
      .then(res => {
        observer.next(res.rows.item(0).total);
    })
      .catch(e => {
        observer.next(0);
        console.log(e);
      });
     });
    },);

   }

   GetFutureDeliveriesProductCount(){
    let query = 'SELECT COUNT(*) AS total FROM Products WHERE futureDeliveryDate not null';
    console.log("QUERY" , query);
    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(query, {})
      .then(res => {
        console.log("RESS" , res);
        observer.next(res.rows.item(0).total);
    })
      .catch(e => {
        observer.next(0);
        console.log(e);
      });
     });
    },);

   }




  GetBaseImageOfproduct(prodId){

    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM ProductImages WHERE clothesId=? ORDER BY sortOrder ASC', [prodId])
      .then(res => {
        observer.next(res);
    })
      .catch(e => {
        observer.next(e);
        console.log(e);
      });
        
      
    });
  
     },);

  }





   GetAllImagesFromDB(){

    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM ProductImages ORDER BY clothesImageId ASC', {})
       .then(res => {
      
        observer.next(res);
  
      })
      .catch(e => {
        observer.next(e);
        console.log(e);
      });
        
      
    });
  
     },);

   }

  




}
