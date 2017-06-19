import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-reward-overview',
  templateUrl: 'overview.html'
})
export class RewardOverviewPage {
  reward: any = {};
  constructor(public navCtrl: NavController, private params: NavParams) {
    this.reward = params.data;
  }
}
