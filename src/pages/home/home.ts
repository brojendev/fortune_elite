import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { RewardsPage } from '../rewards/rewards';
import { LoginPage } from '../login/login';
import { DistributorSearchPage } from '../distributor-search/distributor_search';
import { OrdersPage } from '../orders/orders';
import { ContactPage } from '../contact/contact';
import { AboutPage } from '../about/about';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  pages: any;
  userName: any;
  constructor(public navCtrl: NavController, private localStorageService: LocalStorageService) {
    this.pages = [
      { title: 'Claim Sale', component: DistributorSearchPage, img: 'assets/claim-sale.png', data: { registerPurchase: true } },
      { title: 'My Order', component: OrdersPage, img: 'assets/MyOrders.png' },
      { title: 'Rewards', component: RewardsPage, img: 'assets/home_rewards.png' },
      { title: 'Contact Us', component: ContactPage, img: 'assets/home_contact.png' },
    ];
  }

  ngOnInit() {
    if (!this.localStorageService.get('token')) {
      this.navCtrl.push(LoginPage);
    } else {
      this.userName = this.localStorageService.get('first_name');
    }
  }

  openPage(page) {
    if (page.title === 'Home') {
      return;
    }
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.push(page.component, page.data);
  }

  goToProfile(){
    this.navCtrl.push(ProfilePage);
  }
}
