import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isUserLoggedIn: boolean = false;
  updatedData;
  isSuccess;
  reason;
  updatedSecondData;
  public isSideBarShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public selectedNavTab: BehaviorSubject<any> = new BehaviorSubject<any>('');
  constructor() {
    if(localStorage.getItem('isUserLoggedIn') === 'true') {
      this.isUserLoggedIn = true;
    }
   }

  isLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }

  setData(updatedData) {
    this.updatedData = updatedData;
  }

  setSecondData(updatedSecondData) {
    this.updatedSecondData = updatedSecondData;
  }

  getData() {
    return this.updatedData;
  }

  getSecondData() {
    return this.updatedSecondData;
  }
}
