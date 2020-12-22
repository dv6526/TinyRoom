import { Component, OnInit, Input } from '@angular/core';

import { Navigation } from '../../classes/navigation';
import { DataService } from "../../services/data.service";
import { CookieService } from "ngx-cookie-service";

// TODO: Ko se loginamo je okej, ko se logoutamo je okej, ko se loginamo ponovno ni username-a
// Če pa je refresh in se loginamo oziroma, če že imamo piškotke potem je tud okej

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private cookieService: CookieService
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

  private body: any = <HTMLDivElement> document.body;
  public script: any = document.createElement('script');

  deleteCookies() {
    console.log("bla");
    this.username = undefined;
    this.cookieService.deleteAll();
  }

  ngOnInit(): void {
  }
}
