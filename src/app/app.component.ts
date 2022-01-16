import { Component, OnInit } from '@angular/core';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'bvp-ui';
  isSideBarShown = false;

  constructor(private userService: UserService) {
    this.userService.isSideBarShown.subscribe(value => {
      this.isSideBarShown = value;
    })
  }

  ngOnInit() {

  }
}
