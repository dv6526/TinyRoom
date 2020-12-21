import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})

export class FrameComponent implements OnInit {

  constructor(private dataService:DataService, private cookieService: CookieService) { }

  public activeTab: number = 1;
  public name: string;

  changeActive(event: any): void {
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
        console.log("profile");
        break;
      }
      default: {
        console.log("neki ne štima");
        break;
      }
    }
  }

  ngDoCheck(): void {
    // grdo ampak deluje
    if(this.name != this.cookieService.get('user')) {
      this.name = this.cookieService.get('user');
    }
  }

  ngOnInit(): void {
    if(this.cookieService.get('user')) {
      console.log(this.cookieService.get('user') + "<-");
      this.name = this.cookieService.get('user');
    }
  }

  ngOnDestroy(): void {
    // brisi piskotke
    console.log("ja dej jih");
  }

}
