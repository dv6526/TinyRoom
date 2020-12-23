import { Component, OnInit, Input } from '@angular/core';

import { Navigation } from '../../classes/other/navigation';
import { DataService } from "../../services/data.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
// V angular.json -> scripts sem dodal naš script.js. S tem deklariraš funkcijo iz tiste skripte in jo lahko kasneje kličeš
declare const exit: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  @Input() public activeTab: number = 0;
  @Input() public username: string;

  navigation: Navigation[] = [
    { href: "",
      value: "CHAT"},
    { href: "private",
      value: "MY ROOM"},
    { href: "profile",
      value: "PROFILE"},
    { href: "signin",
      value: "LOG OUT"}
  ];

  deleteCookies(link: string) {
    if(link == 'LOG OUT') {
      this.dataService.user = null;
      this.cookieService.deleteAll();
      this.router.navigate(['signin']);
    }
  }

  onExit(link: string): void {
    if(link != 'CHAT')
      // "script.js" call => call if not entering the world
      exit();
  }

  ngOnInit(): void {
  }
}
