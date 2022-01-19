import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  selectedNavItem;
  links = [
    { title: 'Criteria 1', fragment: '/landing/1/1_1_1', id: "1" },
    { title: 'Criteria 2', fragment: '/landing/2/2_0_1', id: "2" },
    { title: 'Criteria 3', fragment: '/landing/3/3_1_1', id: "3" },
    { title: 'Criteria 4', fragment: '/landing/4/4_1_1', id: "4" },
    { title: 'Criteria 5', fragment: '/landing/5/5_1_1', id: "5" },
    { title: 'Criteria 6', fragment: '/landing/6/6_1_1', id: "6" },
    { title: 'Criteria 7', fragment: '/landing/7/7_1_1', id: "7" },
    { title: 'Criteria 8', fragment: '/landing/8/8_1_1', id: "8" }
  ];
  constructor(public route: ActivatedRoute, private router: Router, private userService: UserService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {return false;}
   }

  ngOnInit(): void {
    this.userService.selectedNavTab.subscribe( value => {
      this.selectedNavItem = value;
    });
  }

  goToPage(link) {
    this.router.navigateByUrl(link);
  }
}
