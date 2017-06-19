import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { GeneralService } from '../../service/general.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('pieCanvas') pieCanvas;
  barChart: any;
  pieChart: any;

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private localStorageService: LocalStorageService,
              public generalService: GeneralService) {

  }

  ionViewDidEnter(){
    this.initData();
  }

  initData(){
    this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
            labels: ["Product 1", "Product 2", "Product 3", "Product 4"],
            datasets: [{
                label: 'Target',
                data: [12, 19, 3,10],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 99, 132)',
                ],
                borderWidth: 1
            },
            {
                label: 'Achivement',
                data: [12, 2, 3,5],
                backgroundColor: [
                  'rgb(54, 162, 235)',
                  'rgb(54, 162, 235)',
                  'rgb(54, 162, 235)',
                  'rgb(54, 162, 235)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            legend: {
              display: true,
              labels:{
                boxWidth: 10,
                fontSize: 10,
              }

            }
        }

    });

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
        type: 'doughnut',
        data: {
            labels: ["Product 1", "Product 2", "Product 3", "Product 4"],
            datasets: [{
                data: [12, 19, 3,10],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 199, 32)',
                    'rgb(255, 99, 13)',
                    'rgb(5,155,255)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
              display: true,
              labels:{
                boxWidth: 10,
                fontSize: 10,
              }

            }
        }

    });
  }

  strip(html: string) {
  	return html.replace(/<(?:.|\n)*?>/gm, '');
  }

  getErrorAlert(title: string, message: string) {
    return this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    });
  }

  getLoadingDialog() {
    return this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="loading-box">
          <img src="assets/loading.png"><br>
          Loading, please wait...
        </div>`
    });
  }

  getToken() {
    return this.localStorageService.get('token');
  }

}
