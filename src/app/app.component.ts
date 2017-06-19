import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalStorageService } from 'angular-2-local-storage';
import { Toast } from '@ionic-native/toast';

import { SharedService } from '../service/shared.service';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { RewardsPage } from '../pages/rewards/rewards';
import { NewsPage } from '../pages/news/news';
import { ContactPage } from '../pages/contact/contact';
import { FaqPage } from '../pages/faq/faq';
import { OrdersPage } from '../pages/orders/orders';
import { CartPage } from '../pages/cart/cart';
import { DealerSearchPage } from '../pages/dealer-search/dealer_search';
import { ChartPage } from '../pages/chart/chart';

import { DomSanitizer } from '@angular/platform-browser';

declare var FirebasePlugin: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  backButtonPressedOnceToExit = false
  pages: any;
  defaultProfileImage: string = 'assets/profile_placeholder.png';
  profileImage: any;
  userName: any;

  ngOnInit() {
    this.profileImage = this.defaultProfileImage;
    if (!this.localStorageService.get('token')) {
      this.rootPage = LoginPage
    } else {
      this.profileImage = this.localStorageService.get('profile_pic');
      this.userName = this.localStorageService.get('first_name');
    }

    console.log(this.localStorageService.get('profile_pic'));
  }

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private sharedService: SharedService,
    private _DomSanitizationService: DomSanitizer,
    private localStorageService: LocalStorageService,
    private toast: Toast,
    public alertCtrl: AlertController) {
    this.initializeApp();
    this.userName = '';
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'My Profile', component: ProfilePage },
      { title: 'Rewards', component: RewardsPage },
      { title: 'My Orders', component: OrdersPage },
      { title: 'My Cart', component: CartPage },
      { title: 'Dealer Locator', component: DealerSearchPage },
      { title: 'Register Purchase', component: DealerSearchPage, data: { registerPurchase: true } },
      { title: 'Charts', component: ChartPage},
      { title: 'News and Updates', component: NewsPage },
      { title: 'Contact Us', component: ContactPage },
      { title: 'FAQs', component: FaqPage }
    ];

    this.sharedService.on('login', (event) => {
      this.profileImage = this.localStorageService.get('profile_pic');
    });

    this.sharedService.on('profile_update', (event) => {
      this.profileImage = this.localStorageService.get('profile_pic');
    });

    this.sharedService.on('logout', (event) => {
      this.profileImage = this.defaultProfileImage;
    });

    platform.ready().then(() => {
      // Register tap again to exit //
      platform.registerBackButtonAction(() => {
        if (this.backButtonPressedOnceToExit) {
          this.platform.exitApp();
        } else if (this.nav.canGoBack()) {
          this.nav.pop({});
        } else {
          this.backButtonPressedOnceToExit = true;

          this.toast.show('Press again to exit', '2000', 'bottom').subscribe(
            toast => {
              console.log(toast);
            }
          );
          setTimeout(() => {
           this.backButtonPressedOnceToExit = false;
          },2000)
        }
      });
      // END //

      // Register FCM //

      if (typeof FirebasePlugin !== 'undefined') {
        console.log(FirebasePlugin);
        FirebasePlugin.onNotificationOpen(function(notification) {
          console.log(notification);
          if(notification.body !== undefined){
            alertCtrl.create({
              title: 'Notification',
              message: notification.body,
              buttons: ['Dismiss']
            }).present();
          }
        }, function(error) {
          console.error(error);
        });
        let self = this;
        FirebasePlugin.onTokenRefresh(function(token) {
          // save this server-side and use it to push notifications to this device
          self.localStorageService.set('device_id', token);
          console.log(token);
        }, function(error) {
          console.error(error);
        });
      }

      // END //
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.title === 'Home') {
      return;
    }
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component, page.data);
  }
}
