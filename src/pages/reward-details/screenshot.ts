import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-reward-screenshot',
  templateUrl: 'screenshot.html'
})
export class RewardScreenshotPage {
  reward: any = {};
  constructor(public navCtrl: NavController, private params: NavParams) {
    this.reward = params.data;
  }
}
