import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-reward-specs',
  templateUrl: 'specs.html'
})
export class RewardSpecsPage {
  reward: any = {};
  constructor(public navCtrl: NavController, private params: NavParams) {
    this.reward = params.data;
  }
}
