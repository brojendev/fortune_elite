import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LocalStorageModule } from 'angular-2-local-storage';
import { Camera } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';

import {MomentModule} from 'angular2-moment';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { FabricatorRegisterPage } from '../pages/fabricator-register/register';
import { LoginPage } from '../pages/login/login';
import { AddressPage } from '../pages/address/address';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot_password';
import { ChangePasswordPage } from '../pages/change-password/change_password';
import { RewardsPage } from '../pages/rewards/rewards';
import { NewsPage } from '../pages/news/news';
import { ContactPage } from '../pages/contact/contact';
import { FaqPage } from '../pages/faq/faq';
import { OrdersPage } from '../pages/orders/orders';
import { CartPage } from '../pages/cart/cart';
import { OrderSummaryPage } from '../pages/order-summary/order_summary';
import { DistributorSearchPage } from '../pages/distributor-search/distributor_search';
import { RewardDetailsPage } from '../pages/reward-details/reward_details';
import { PointsHistoryPage } from '../pages/points-history/points_history';
import { OrderDetailsPage } from '../pages/orders/order_details';
import { DistributorSearchResultPage } from '../pages/distributor-search/result';
import { RegisterPurchasePage } from '../pages/register-purchase/register_purchase';
import { AboutPage } from '../pages/about/about';
import { ListPage } from '../pages/list/list';
import { ChartPage } from '../pages/chart/chart';

import { RewardOverviewPage } from '../pages/reward-details/overview';
import { RewardScreenshotPage } from '../pages/reward-details/screenshot';
import { RewardSpecsPage } from '../pages/reward-details/specs';

import { NewsDetailModal } from '../pages/news/news_detail';
import { FiltersModal } from '../pages/rewards/filters';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AppConfig } from '../service/app.config';
import { AuthService } from '../service/auth.service';
import { ResponseService } from '../service/response.service';
import { GeneralService } from '../service/general.service';
import { UserService } from '../service/user.service';
import { Utils } from '../service/utils';
import { SharedService } from '../service/shared.service';
import { RewardService } from '../service/reward.service';
import { DealerService } from '../service/dealer.service';
import { OrderService } from '../service/order.service';

import {enableProdMode} from '@angular/core';
enableProdMode();

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FabricatorRegisterPage,
    ProfilePage,
    LoginPage,
    ForgotPasswordPage,
    ChangePasswordPage,
    AddressPage,
    RewardsPage,
    NewsPage,
    ContactPage,
    FaqPage,
    OrdersPage,
    CartPage,
    DistributorSearchPage,
    RewardDetailsPage,
    NewsDetailModal,
    FiltersModal,
    RewardOverviewPage,
    RewardScreenshotPage,
    RewardSpecsPage,
    PointsHistoryPage,
    OrderDetailsPage,
    DistributorSearchResultPage,
    RegisterPurchasePage,
    OrderSummaryPage,
    AboutPage,
    ListPage,
    ChartPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    LocalStorageModule.withConfig({
      prefix: 'fortuneElite-local',
      storageType: 'localStorage'
    }),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FabricatorRegisterPage,
    ProfilePage,
    LoginPage,
    ForgotPasswordPage,
    ChangePasswordPage,
    AddressPage,
    RewardsPage,
    NewsPage,
    ContactPage,
    FaqPage,
    OrdersPage,
    CartPage,
    DistributorSearchPage,
    RewardDetailsPage,
    NewsDetailModal,
    FiltersModal,
    RewardOverviewPage,
    RewardScreenshotPage,
    RewardSpecsPage,
    PointsHistoryPage,
    OrderDetailsPage,
    DistributorSearchResultPage,
    RegisterPurchasePage,
    OrderSummaryPage,
    AboutPage,
    ChartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppConfig,
    ResponseService,
    AuthService,
    GeneralService,
    UserService,
    Utils,
    SharedService,
    Camera,
    Toast,
    RewardService,
    DealerService,
    OrderService
  ]
})
export class AppModule {}
