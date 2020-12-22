import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

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

  public activeTab: number = 1;
  public username: string;

  changeActive(event: any): void {
    // If credentials aren't there redirect to signin else set navigation username
    if(this.cookieService.get('user') == "") {
      this.router.navigate(['signin']);
      //return;
    } else {
      this.username = this.dataService.user.username;
    }
    let active: string = event.constructor.name;
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
      case 'SigninComponent': {
        //this.activeTab = 0;
        this.activeTab = -1;
        console.log("signin");
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
      let body: any = <HTMLDivElement> document.body;
      let script: any = document.createElement('script');
      let skins = {"bunny" : 0, "goat":1, "rat":2};
      script.innerHTML  = 'username="' + this.dataService.user.username + '";';
      script.innerHTML += 'sprite_idx = "' + skins[this.dataService.user.chosen_skin] + '";';
      script.innerHTML += 'my_id = "' + this.dataService.user._id + '";';
      script.innerHTML += 'weather = "clear sky";'                    // TODO: get weather or check for weather availibility in script!
      script.innerHTML += 'rank = "' + this.dataService.user.rank + '";';
      script.async = true;
      script.defer = true;
      body.appendChild(script);
      body.removeChild(script);
    }
  }
}
