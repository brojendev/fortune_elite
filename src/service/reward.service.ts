import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from './app.config';
import { ResponseService } from './response.service';
import { Utils } from './utils';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RewardService {
  constructor(private http: Http, private appConfig: AppConfig, private responseService: ResponseService, private utils: Utils) { }

  catalogProductUrl = this.appConfig.baseUrl + '/fortune_demo_req/catalog_products';
  addToCartUrl = this.appConfig.baseUrl + '/fortune_demo_req/addcart';
  cartUrl = this.appConfig.baseUrl + '/fortune_demo_req/mycart';
  cartUpdateUrl = this.appConfig.baseUrl + '/fortune_demo_req/save_quantity';
  removeCartItemUrl = this.appConfig.baseUrl + '/fortune_demo_req/removecart';
  placeOrderUrl = this.appConfig.baseUrl + '/fortune_demo_req/order';

  defaultHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  fetchCatalogProduct(token: any, pageNumber: any, filterData: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
      pageNumber: pageNumber,
    };

    if(filterData.categoryId !== undefined && filterData.categoryId !=0){
      body['categoryId']= filterData.categoryId;
    }
    if(filterData.minPrice !== undefined){
      body['min'] = filterData.minPrice;
    }
    if(filterData.maxPrice !== undefined){
      body['max'] = filterData.maxPrice;
    }

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.catalogProductUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  addToCart(token: any, productInfo: any, quantity: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
      prod_id: productInfo.productId,
      price: productInfo.ProductPrice,
      prod_name: productInfo.productName,
      price_in_points: productInfo.pricePoints,
      quantity: quantity
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.addToCartUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  UpdateCartQty(token: any, cart_id: any, productInfo: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
      cart_id: cart_id,
      product_id: productInfo.product_id,
      quantity: productInfo.quantity
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.cartUpdateUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  removeCartItem(token: any, cart_id: any, productInfo: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
      cart_id: cart_id,
      product_id: productInfo.product_id
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.removeCartItemUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  placeOrder(token: any, cart_id: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
      cartId: cart_id
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.placeOrderUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }

  getCartDetails(token: any): Promise<any> {
    let body = {
      APIkey: this.appConfig.APIKey,
      token: token,
      programId: this.appConfig.programId,
    };

    let options = new RequestOptions({ headers: this.defaultHeaders });

    return this.http.post(this.cartUrl, this.utils.transformRequest(body), options).toPromise().then(this.responseService.extractData).catch(this.responseService.handleAuthError);
  }
}
