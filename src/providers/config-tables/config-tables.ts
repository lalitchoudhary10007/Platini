import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AppUtilsProvider } from '../../providers/app-utils/app-utils'
import { Observable } from 'rxjs/Observable';


/*
  Generated class for the ConfigTablesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigTablesProvider {

  milestones: any = [];

  constructor(public sqlite: SQLite , public appUtils: AppUtilsProvider) {
    console.log('Hello ConfigTablesProvider Provider');
  }


  CreateConfigTables(){

    this.CreateTermsTable();
    this.CreateShipViasTable();
    this.CreateOrderTagsTable();
    this.CreateImportsTable();
    this.CreateCategoriesTable(); 
  }

  TestHtml(){

    return "<h1>test</h1>" ;
    

  }





  CreateImportsTable(){

    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    })
    .then((db: SQLiteObject) =>{
     db.executeSql('CREATE TABLE IF NOT EXISTS Imports(id INTEGER PRIMARY KEY, milestone TEXT, sort_order INTEGER, completed_till TEXT, status TEXT, data_json TEXT, imported_at TEXT)', {})
     .then(res => console.log('TERMS ENTITY CREATED'))
     .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  }

  SaveImportsEntity(data){

    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO Imports VALUES(null,?,?,?,?,?,?)',[data.Milestone,data.SortOrder,data.CompletedTill,data.Status,data.DataJSON,data.ImportedAt])
        .then(res => {
          console.log("Imports SAVED" , res);
        })
        .catch(e => {
          console.log(e);
         });
      }).catch(e => {
      console.log(e);
      
    });

  }

  UpdateImportEntity(import_id ,milestone , status,completed , json,importedat){

    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE Imports SET milestone=?, status=?,completed_till=?,data_json=?,imported_at=?  WHERE id=?',[milestone,status, completed,json,importedat , import_id])
      .then(res => {
       // console.log('UPDATE IMPORT ENTITY' , res);
     
      })
        .catch(e => console.log(e));

    })

  }

  GetAllUnCompleteEntity(){
   let UnCompletedmilestones: any = [];
    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM Imports WHERE status!=? ORDER BY sort_order DESC', ['3'])
      .then(res => {
        UnCompletedmilestones = [];
      
        for(var i=0; i<res.rows.length; i++) {
          console.log("UN COMPLETE IMPORT ENTITY" ,"Milestone:-", res.rows.item(i).milestone , "Completed:-" ,res.rows.item(i).completed_till ,"Status:-", res.rows.item(i).status  ,"JSON DATA:-", res.rows.item(i).data_json);
          
          UnCompletedmilestones.push({id:res.rows.item(i).id,
            milestone:res.rows.item(i).milestone,
            sort_order:res.rows.item(i).sort_order,
            completed_till:res.rows.item(i).completed_till,
            status:res.rows.item(i).status,
            data_json:res.rows.item(i).data_json,
            imported_at:res.rows.item(i).imported_at})
  
        }
  
        observer.next(UnCompletedmilestones);
  
      })
      .catch(e => {
        observer.next(e);
        console.log(e);
      });
        
      
    });
  
     },);

  }



  GetAllImports(){
   return Observable.create(observer => {
    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM Imports ORDER BY sort_order DESC', {})
    .then(res => {
      this.milestones = [];
    
      for(var i=0; i<res.rows.length; i++) {
        console.log("IMPORT ENTITY" ,"Milestone:-", res.rows.item(i).milestone , "Completed:-" ,res.rows.item(i).completed_till ,"Status:-", res.rows.item(i).status  ,"JSON DATA:-", res.rows.item(i).data_json);
        
        this.milestones.push({id:res.rows.item(i).id,
          milestone:res.rows.item(i).milestone,
          sort_order:res.rows.item(i).sort_order,
          completed_till:res.rows.item(i).completed_till,
          status:res.rows.item(i).status,
          data_json:res.rows.item(i).data_json,
          imported_at:res.rows.item(i).imported_at})

      }

      observer.next(this.milestones);

 

    })
    .catch(e => {
      observer.next(e);
      console.log(e);
    });
      
    
  });

   },);

}




  CreateTermsTable(){

    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    })
    .then((db: SQLiteObject) =>{
     db.executeSql('CREATE TABLE IF NOT EXISTS Terms(termId INTEGER, name TEXT, isActive TEXT, sortOrder TEXT, isDelete TEXT, dateCreated TEXT, dateUpdated TEXT)', {})
     .then(res => console.log('TERMS ENTITY CREATED'))
     .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  }

  SaveTermsEntity(data , pos , length){
   
     return Observable.create(observer => {

      this.sqlite.create({
         name: 'Platini.db',
         location: 'default'
          }).then((db: SQLiteObject) => {
              db.executeSql('INSERT INTO Terms VALUES(?,?,?,?,?,?,?)',[data.termId,data.name,data.isActive,data.sortOrder,data.isDelete,data.dateCreated,data.dateUpdated])
              .then(res => {
          
               if(pos == length){
                this.UpdateImportEntity(2 ,'Masters/1' , 3 , 'ALL' , '' , this.appUtils.GetCurrentDateTime());
                this.GetAllImports();
                observer.next(pos);
                }else{
                this.UpdateImportEntity(2 ,'Masters/1', 2 , pos , data , this.appUtils.GetCurrentDateTime());
                observer.next(pos);
                }

                 })
                 .catch(e => {
                  console.log("CATCH INSERT" , e);
               });
          })
        },
      );
    }


  CreateShipViasTable(){
    
     this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    })
    .then((db: SQLiteObject) =>{
     db.executeSql('CREATE TABLE IF NOT EXISTS ShipVias(shipViaId INTEGER, name TEXT, isActive TEXT, sortOrder TEXT, dateCreated TEXT, dateUpdated TEXT, isDelete TEXT)', {})
     .then(res => console.log('SHIPVIAs ENTITY CREATED'))
     .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  }

  SaveShipViasEntity(data , pos , length){
    return Observable.create(observer => {
    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO ShipVias VALUES(?,?,?,?,?,?,?)',[data.shipViaId,data.name,data.isActive,data.sortOrder,data.dateCreated,data.dateUpdated,data.isDelete])
        .then(res => {
          console.log("SAVED" , res);
         if(pos == length){
          this.UpdateImportEntity(2 , 'Masters/2' , 3 , 'ALL' , '' , this.appUtils.GetCurrentDateTime());
          this.GetAllImports();
          observer.next(pos);
          }else{
          this.UpdateImportEntity(2 , 'Masters/2' , 2 , pos , data , this.appUtils.GetCurrentDateTime());
          observer.next(pos);
          }
        })
        .catch(e => {
          console.log(e);
          observer.next(e);
         });
      }).catch(e => {
      console.log(e);
      observer.next(e);
    });

  },);
  }



  CreateOrderTagsTable(){

    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    })
    .then((db: SQLiteObject) =>{
     db.executeSql('CREATE TABLE IF NOT EXISTS OrderTags(orderTagId INTEGER, name TEXT, isDefault TEXT, isActive TEXT, isDelete TEXT, sortOrder TEXT, dateCreated TEXT, dateUpdated TEXT)', {})
     .then(res => console.log('ORDERTAGS ENTITY CREATED'))
     .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  }

  SaveOrderTagsEntity(data , pos , length){
    return Observable.create(observer => {
    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO OrderTags VALUES(?,?,?,?,?,?,?,?)',[data.orderTagId,data.name,data.isDefault,data.isActive,data.isDelete,data.sortOrder,data.dateCreated,data.dateUpdated])
        .then(res => {
          console.log("SAVED" , res);
          if(pos == length){
            this.UpdateImportEntity(2 , 'Masters/3' , 3 , 'ALL' , '' , this.appUtils.GetCurrentDateTime());
            this.GetAllImports();
            observer.next(pos);
            }else{
            this.UpdateImportEntity(2 , 'Masters/3', 2 , pos , data , this.appUtils.GetCurrentDateTime());
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



  CreateCategoriesTable(){

    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    })
    .then((db: SQLiteObject) =>{
     db.executeSql('CREATE TABLE IF NOT EXISTS Categories(categoryId INTEGER , name TEXT, sortOrder INTEGER, parentId INTEGER, isActive TEXT, isDelete TEXT, CategoryLevel INTEGER, dateCreated TEXT, dateUpdated TEXT)', {})
     .then(res => console.log('CATEGORIES ENTITY CREATED'))
     .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

  }


  SaveCategoryINDB(data , pos , length){
    return Observable.create(observer => {
    this.sqlite.create({
      name: 'Platini.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO Categories VALUES(?,?,?,?,?,?,?,?,?)',[data.categoryId,data.name,data.sortOrder,data.parentId,data.isActive,data.isDelete,data.CategoryLevel,data.dateCreated,data.dateUpdated])
        .then(res => {
          console.log("SAVED" , res);
          if(pos == length){
            this.UpdateImportEntity(3 , 'Categories' , 3 , 'ALL' , '' , this.appUtils.GetCurrentDateTime());
            observer.next(pos);
            }else{
            this.UpdateImportEntity(3 , 'Categories', 2 , pos , '' , this.appUtils.GetCurrentDateTime());
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



  GetFirstLevelCategories(){
  
    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM Categories WHERE CategoryLevel=? AND parentId=? AND isActive=? ORDER BY sortOrder ASC', [0 , 0 , 'true'])
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

  GetSecondLevelCategories(parentid){
  
    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM Categories WHERE CategoryLevel=? AND parentId=? AND isActive=? ORDER BY sortOrder ASC', [1 , parentid , 'true'])
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
   
  GetThirdLevelCategories(parentid){
  
    return Observable.create(observer => {
      this.sqlite.create({
        name: 'Platini.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM Categories WHERE CategoryLevel=? AND parentId=? AND isActive=? ORDER BY sortOrder ASC', [2 , parentid , 'true'])
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
