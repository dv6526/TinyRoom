import { Component, OnInit } from '@angular/core';

import { CookieService } from "ngx-cookie-service";
import { DataService } from "../../services/data.service";
import { Router } from "@angular/router";
import {User} from "../../classes/models/user";
import {UserDto} from "../../classes/DTOs/user-dto";

declare const setUserData: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private dataService: DataService,
    private router: Router
  ) { }

  public signInError: string;
  public registerError: string;

  public username: string;
  public password: string;

  public registerEmail: string;
  public registerUsername: string;
  public registerPassword: string;

  public login(): void {
    // validation
    const regName = /^[a-zA-Z0-9]+$/;    ///^[a-zA-Z0-9]{1,10}$/;
    const regPass = /^.{3,}$/;
    if(!regName.test(this.username)) {
      console.log("Username does not fit the specification");
      this.signInError = 'Username does not fit the specification';
      return;
    }
    if(!regPass.test(this.password)) {
      console.log("Password does not fit the specification");
      this.signInError = 'Password does not fit the specification';
      return;
    }
    // verification
    this.dataService.getUserData(this.username, this.password).then(response => {
      if(response.length == 0) {
        console.log('Wrong username or password!');
        this.signInError = 'Wrong username or password!';
        return;
      } else {
        console.log("Logged in.");
        this.IDsuccess(response);
        // // decode response, set appropriate info
        //
        // // "script.js" call (added in angular.json through assets) => set User data -> preparation for entering the World
        // setUserData(response['zeton']);
        //
        // // save data to dataService
        // this.dataService.user = JSON.parse(response['user']);
        // this.dataService.zeton = response['zeton'];
        //
        // // save cookie (stringify object data)
        // this.cookieService.set('user', JSON.stringify(response['user']));
        // this.cookieService.set('token', response['zeton']);
        //
        // // Show world
        // this.router.navigate(['']).then().catch();
        return;
      }
    });
  }

  public register(): void {
    const regEmail = /^\S+@\S+$/;
    const regName = /^[a-zA-Z0-9]+$/;  ///^[a-zA-Z0-9]{1,10}$/;
    const regPass = /^.{3,}$/;

    // Validation
    if(!regEmail.test(this.registerEmail)) {
      this.registerError = 'Email does not fit the specification';
      return;
    }
    if(!this.registerUsername || !regName.test(this.registerUsername)) {
      this.registerError = 'Username does not fit the specification';
      return;
    }
    if(!this.registerPassword || !regPass.test(this.registerPassword)) {
      this.registerError = 'Password does not fit the specification';
      return;
    }
    // Verification
    // TODO: watch out! admin is harcoded @Warning
    // Prepare User data transfer object
    let newUser: UserDto = {
      username : this.registerUsername,
      rank: "admin",
      email: this.registerEmail,
      password: this.registerPassword
    }
    this.dataService.createNewUser(newUser)
      .then(response => {
        console.log("Registered successfully and logged in.");
        this.IDsuccess(response);
        return;
      }).catch(error => {
        this.registerError = "Username or Email is already in use!";
      });

  }

  private IDsuccess(response:any) {
    // decode response, set appropriate info

    // "script.js" call (added in angular.json through assets) => set User data -> preparation for entering the World
    setUserData(response['zeton']);

    // save data to dataService
    this.dataService.user = JSON.parse(response['user']);
    this.dataService.zeton = response['zeton'];

    // save cookie (stringify object data)
    this.cookieService.set('user', response['user']);
    this.cookieService.set('token', response['zeton']);

    // Show world
    this.router.navigate(['']).then().catch();
    return;
  }

  private getComponentName(): string {
    return "SigninComponent";
  }

  ngOnInit(): void { }

}
