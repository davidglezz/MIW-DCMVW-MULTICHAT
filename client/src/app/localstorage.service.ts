import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageService {
  public localStorage: Storage = window.localStorage;
  constructor() { }

  setValue(key, val) {
    this.localStorage.setItem(key, JSON.stringify(val));
  }

  getValue(key) {
    this.localStorage.getItem(key);
  }

  delete(key) {
    this.localStorage.removeItem(key);
  }
}
