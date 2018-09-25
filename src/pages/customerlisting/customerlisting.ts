import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CustomerlistingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customerlisting',
  templateUrl: 'customerlisting.html',
})
export class CustomerlistingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    $(document).ready(function () {
      $(".plus").click(function () {
        
        $('.row.show-row').removeClass('show-row');
        $(".plus").show();
        $(this).parent().addClass('show-row');
        $(this).hide();
        $(this).next().show();
      });

      $(".minus").click(function () {
        $(this).parent().removeClass('show-row');
        $('.plus').show();
        $('.minus').hide();
      });

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerlistingPage');
  }

}
