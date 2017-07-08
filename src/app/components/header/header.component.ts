// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmitterService } from '../../shared/services/api/emitter.service';
import { ApiService } from '../../shared/services/api/api.service';
import { AppInfo } from '../../shared/models/appinfo';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

// Component class
export class HeaderComponent implements OnInit, OnDestroy {
  public info:AppInfo = new AppInfo();
  private subscription: ISubscription;

  constructor(
    private apiService: ApiService
  ){}

  ngOnInit() {
    let infoGetOperation: Observable<AppInfo>;

    infoGetOperation = this.apiService.getAppInfo();
    this.subscription = infoGetOperation.subscribe(
      info => {
        this.info = info;
        EmitterService.get('APP_INFO').emit(info);
      },
      err => {
        console.log('API error');
      });

    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

}


