import { Observable } from 'rxjs/Rx';

export class SharedService {
  observable: any;
  observer: any;

  status: any = {
    1: {
      name: 'Ordered',
      img: 'assets/order_status_ordered.png'
    },
    2: {
      name: 'Dispatched',
      img: 'assets/order_status_dispatched.png'
    },
    3: {
      name: 'Delivered',
      img: 'assets/order_status_delivered.png'
    },
    4: {
      name: 'Cancelled',
      img: 'assets/order_status_cancelled.png'
    }
  }

  constructor() {
    this.observable = Observable.create((observer) => {
      this.observer = observer;
    }).share();
  }

  broadcast(event) {
    this.observer.next(event);
  }

  on(eventName, callback) {
    this.observable.filter((event) => {
      return event.name === eventName;
    }).subscribe(callback);
  }

  orderStatusList() {
    return this.status;
  }
}
