import { Component, OnInit } from '@angular/core';

import { CookieService } from "ngx-cookie-service";
import { DataService } from "../../services/data.service";
import {Data} from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public cookieService: CookieService, public dataService: DataService) { }

  public signInError: string = "";
  public registerError: string = "";

  public username: string = "";
  public password: string = "";

  login() {
    // validation
    const regName = /^[a-zA-Z0-9]{1,10}$/;
    const regPass = /^.{3,}$/;
    if(!regName.test(this.username)) {
      this.signInError = 'Username does not fit the specification';
      return;
    }
    if(!regPass.test(this.password)) {
     this.signInError = 'Password does not fit the specification';
      return;
    }

    // verification
    this.cookieService.set('user', this.username);
    this.cookieService.set('password', this.password);
    this.dataService.getUserData(this.username, this.password).then(response => {
      if(response.length == 0) {
        this.signInError = 'Wrong username or password!';
        return;
      } else {
        this.dataService.user = response[0];
        this.cookieService.set('user', this.username);
        this.cookieService.set('user_id', response[0]._id);
        this.cookieService.set('rank',  response[0].rank);
        this.cookieService.set('uporabnik', JSON.stringify(response[0]));
        this.cookieService.set("weather", "clear sky");
        console.log(this.cookieService.get('uporabnik'));
        var skins = {"bunny" : 0, "goat":1, "rat":2};
        this.cookieService.set('sprite_idx',  skins[response[0].chosen_skin]);
        let body: any = <HTMLDivElement> document.body;
        let script: any = document.createElement('script');
        script.innerHTML = 'username="' + this.cookieService.get('user') + '";' + 'sprite_idx = "' + this.cookieService.get("sprite_idx") + '";' + 'my_id = "' + this.cookieService.get("my_id") + '";' + 'weather = "clear sky";' + 'rank = "' + this.cookieService.get("rank") + '";';
        script.async = true;
        script.defer = true;
        body.appendChild(script);
        body.removeChild(script);
        // Show world
      }
    });
  }

  ngOnInit(): void {
  }

}
