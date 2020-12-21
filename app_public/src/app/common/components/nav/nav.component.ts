import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../classes/user';
import { Navigation } from '../../classes/navigation';
import { DataService } from "../../services/data.service";
import { CookieService } from "ngx-cookie-service";
import { PrivateComponent } from "../../components/private/private.component";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private dataService: DataService, private cookieService: CookieService) { }

  @Input() public activeTab: number = 0;
  public username: string;

  //public user: User;
  public user: User = {
    username : "Loading",
    rank: "",
    email: "",
    password: "",
    profile_picture: "",
    bio_title: "",
    bio: "",
    chosen_skin: "",
    _id: ""
  };




  navigation: Navigation[] = [
    { href: "",
      value: "CHAT"},
    { href: "private",
      value: "MY ROOM"},
    { href: "profile",
      value: "PROFILE"},
    { href: "logout",
      value: "LOG OUT"}
  ];

  private body: any = <HTMLDivElement> document.body;
  public script: any = document.createElement('script');

  /*
  private getUserData(): void {
    // pricakujemo samo en zadetek (ali nobenega) zato iz tabele vzamemo prvi element
    this.dataService.getUserData(this.dataService.user.username, this.dataService.user.password).then(foundUser => {
      this.user = foundUser[0];
      this.dataService.user = this.user;
    });
  }
*/
  public loadUserDataScript() {
    //this.script.innerHTML = 'let username="' + this.user.username + '";' + 'const sprite_idx = "2";' + 'let my_id = "' + this.user._id + '";' + 'const weather = "clear sky";' + 'const rank = "user";console.log("skripta");';
    //this.script.innerHTML = 'let username = ""; let sprite_idx = 0; let my_id = ""; let weather = ""; let rank = "";';
    this.script.innerHTML = 'username="' + this.cookieService.get('user') + '";' + 'sprite_idx = "' + this.cookieService.get("sprite_idx") + '";' + 'my_id = "' + this.cookieService.get("my_id") + '";' + 'weather = "clear sky";' + 'rank = "' + this.cookieService.get("rank") + '";console.log("skripta");';
    this.script.async = true;
    this.script.defer = true;
    this.body.appendChild(this.script);
  }

  deleteCookies() {
    console.log("bla");
    if(this.user)
      this.user.username = "";
    this.username = "";
    this.cookieService.deleteAll();
  }


  ngOnInit(): void {
    //console.log(this.dataService.user);
    //this.user = this.dataService.user;
    //this.getUserData();
    this.username = this.cookieService.get('user');
    this.user.username = this.cookieService.get('user');
    this.loadUserDataScript();
  }

  ngDoCheck(): void {
    if(this.user != this.dataService.user) {
      this.user = this.dataService.user;
    }
  }

}
