import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

// Typed Data models
import { AppInfo } from '../../models/appinfo';

@Injectable()
export class ApiDataStub{

  private info = new AppInfo();
  public apiUp = false;
  public inProgress = false;

  // Service entry points
  getAppInfo() : Observable<AppInfo> {
    this.info.title = 'TITLE STUB';
    return Observable.of(this.info);
  }

}
