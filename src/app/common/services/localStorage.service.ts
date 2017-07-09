import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() {}

  public isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  public getListOfKeysInLocalStorage(): Array<any> {
    let result = [];
    for (let i = 0; i < localStorage.length; i++) {
      let keyString = localStorage.key(i);
      let key = this.isJsonString(keyString) ? JSON.parse(keyString) : keyString;
      result.push(key);
    }
    return result;
  }

  public getFilteredListOfKeysInLocalStorage(desc): Array<any> {
    return this.getListOfKeysInLocalStorage()
      .filter(key => key.description === desc)
      .map(key => key.name);
  }

  public getItemInLocalStorage(name: string, description = ''): any {
    let keyObj = {
      name: name,
      description: description
    };
    let key = JSON.stringify(keyObj);
    let value = localStorage.getItem(key);
    return JSON.parse(value);
  }

  public setItemInLocalStorage(name: string, data: any, description = ''): void {
    let keyObj = {
      name: name,
      description: description
    };
    let key = JSON.stringify(keyObj);
    let value = JSON.stringify(data);
    localStorage.setItem(key, value);
  }

  public removeItemInLocalStorage(name: string, description = ''): void {
    let keyObj = {
      name: name,
      description: description
    };
    let key = JSON.stringify(keyObj);
    localStorage.removeItem(key);
  }

}
