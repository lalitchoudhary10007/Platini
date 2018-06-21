import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductListingPage } from './product-listing';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    ProductListingPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductListingPage),
    ComponentsModule
  ]
})
export class ProductListingPageModule {}
