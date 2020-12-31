import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { CookieService } from "ngx-cookie-service";
import {ActivatedRoute, Router, RouterEvent} from "@angular/router";

declare const setUserData: any;

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})

export class FrameComponent implements OnInit {

  constructor(
    private dataService:DataService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  public activeTab: number = 0;
  public rank: string;
  public username: string;

  changeActive(event: any): void {
    // If credentials aren't there redirect to signin else set navigation username
    if(this.cookieService.get('user') == "") {
      // exception if we want to get to db
      if(event.getComponentName() != 'DbComponent')
        this.router.navigate(['signin']);
    } else {
      this.username = this.dataService.user.username;
      this.rank = this.dataService.user.rank;
    }
    let active: string = "";
    try {
      active = event.getComponentName();
      console.log("Active link position succesfully acquired!");
    } catch(error) {
      active = "Something went wrong";
      console.log("Something went wrong when coloring current active link! (With acquireing data)");
    }
    switch(active) {
      case 'WorldComponent': {
        this.activeTab = 0;
        console.log("world");
        break;
      }
      case 'PrivateComponent': {
        this.activeTab = 1;
        console.log("private");
        break;
      }
      case 'ProfileComponent': {
        this.activeTab = 2;
        console.log("profile");
        break;
      }
      case 'DbComponent': {
        this.activeTab = -1;
        console.log("db");
        break;
      }
      case 'SigninComponent': {
        this.activeTab = -1;
        this.username = "";
        this.rank = "";
        console.log("signin");
        break;
      }
      case 'GraphAndDataComponent': {
        this.activeTab = 3;
        console.log("graphAndData");
        break;
      }
      default: {
        console.log("Something went wrong when coloring current active link!");
        break;
      }
    }
  }

  ngOnInit(): void {
    // If user refreshes we lose our name - lets aquire it again from cookies
    if(this.cookieService.get('user')) {
      this.dataService.user = JSON.parse(this.cookieService.get('user'));

      //let skins = {"bunny" : 0, "goat":1, "rat":2};
      // "script.js" call
      //setUserData(this.dataService.user.username, skins[this.dataService.user.chosen_skin], this.dataService.user._id, "clear sky", this.dataService.user.rank);
    }
    if(this.cookieService.get('token')) {
      this.dataService.zeton = this.cookieService.get('token');
      setUserData(this.dataService.zeton);
    }
  }
}
