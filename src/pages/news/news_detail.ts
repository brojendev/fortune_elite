import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-news-detail',
  templateUrl: './news_detail.html'
})
export class NewsDetailModal {
  constructor(private params: NavParams, private viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getDate(item: any) {
    return new Date(item.contentDate);
  }
}
