export class AppInfo {
  public title:string;
  public apiVersion: string;
  public path: string;
  public source: string;
  public host: string;

  constructor(){
    this.clear();
  }

  clear() {
    this.title = 'app';
    this.source = "localStorage";
    this.apiVersion = '1.0.0';
    this.path = '/api/';
    this.host = "file";
  }
}

