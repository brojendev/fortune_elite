import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-rewards-filters',
  templateUrl: './filters.html'
})
export class FiltersModal {
  category: any;
  range: any;
  max: any = 10000;
  min: any = 0;
  step: any = 500;
  categories: Array<{name: string, id: string}>;
  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.range = {
      upper: params.data.filter.rangeEnd,
      lower: params.data.filter.rangeStart
    }
    this.categories = params.data.categories

    this.category = params.data.filter.categoryId
    this.max = params.data.rangeEnd
    this.min = params.data.rangeStart
    this.range = {
      upper: params.data.filter.maxPrice !== undefined ? params.data.filter.maxPrice : params.data.rangeEnd,
      lower: params.data.filter.minPrice !== undefined ? params.data.filter.minPrice : params.data.rangeStart
    }

    this.categories = params.data.categories
  }

  dismiss() {
    this.viewCtrl.dismiss({
      category: this.category,
      rangeStart: this.range.lower,
      rangeEnd: this.range.upper
    });
  }
}
