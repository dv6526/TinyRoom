import { Component, OnInit } from '@angular/core';

import { CookieService } from "ngx-cookie-service";
import { DataService } from "../../services/data.service";
import { Router } from "@angular/router";

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

  public signInError: string = "";
  public registerError: string = "";

  public username: string = "";
  public password: string = "";

  public registerEmail: string = "";
  public registerUsername: string = "";
  public registerPassword: string = "";

  // TODO: separate validation from login (look in profile.component.ts)

  login(): void {
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
    this.dataService.getUserData(this.username, this.password).then(response => {
      if(response.length == 0) {
        this.signInError = 'Wrong username or password!';
        return;
      } else {
        console.log("Loged in.");
        // execute script for world credentials
        let body: any = <HTMLDivElement> document.body;
        let script: any = document.createElement('script');
        let skins = {"bunny" : 0, "goat":1, "rat":2};
        script.innerHTML  = 'username="' + response[0].username + '";';
        script.innerHTML += 'sprite_idx = "' + skins[response[0].chosen_skin] + '";';
        script.innerHTML += 'my_id = "' + response[0]._id + '";';
        script.innerHTML += 'weather = "clear sky";'                    // TODO: get weather or check for weather availibility in script!
        script.innerHTML += 'rank = "' + response[0].rank + '";';
        script.async = true;
        script.defer = true;
        body.appendChild(script);

        // save data to dataService
        this.dataService.user = response[0];

        // save cookie (stringify object data)
        this.cookieService.set('user', JSON.stringify(response[0]));

        // Clean executed script after yourself
        body.removeChild(script);

        // Show world
        this.router.navigate(['']);

        console.log(this.dataService.user);

        return;
      }
    });
  }

  register(): void {
    const regEmail = /^\S+@\S+$/;
    const regName = /^[a-zA-Z0-9]{1,10}$/;
    const regPass = /^.{3,}$/;

    // Validation

    if(!regEmail.test(this.registerEmail)) {
      this.registerError = 'Email does not fit the specification';
      return;
    }
    if(!regName.test(this.registerUsername)) {
      this.registerError = 'Username does not fit the specification';
      return;
    }
    if(!regPass.test(this.registerPassword)) {
      this.registerError = 'Password does not fit the specification';
      return;
    }

    // // Verification
    // // TODO: watch out! admin is harcoded @Warning
    // this.dataService.createNewUser(this.registerEmail, this.registerUsername, this.registerPassword, "admin")
    //   .then(response => {
    //     console.log(response);
    //     // TODO: send email
    //
    //     // TODO: navigate to world
    //     this.router.navigate(['']);
    //     console.log("Registered succesfully");
    //     /*
    //     console.log("Loged in.");
    //     // execute script for world credentials
    //     let body: any = <HTMLDivElement> document.body;
    //     let script: any = document.createElement('script');
    //     let skins = {"bunny" : 0, "goat":1, "rat":2};
    //     script.innerHTML  = 'username="' + response[0].username + '";';
    //     script.innerHTML += 'sprite_idx = "' + skins[response[0].chosen_skin] + '";';
    //     script.innerHTML += 'my_id = "' + response[0]._id + '";';
    //     script.innerHTML += 'weather = "clear sky";'                    // TODO: get weather or check for weather availibility in script!
    //     script.innerHTML += 'rank = "' + response[0].rank + '";';
    //     script.async = true;
    //     script.defer = true;
    //     body.appendChild(script);
    //
    //     // save data to dataService
    //     this.dataService.user = response[0];
    //
    //     // save cookie (stringify object data)
    //     this.cookieService.set('user', JSON.stringify(response[0]));
    //
    //     // Clean executed script after yourself
    //     body.removeChild(script);
    //
    //     // Show world
    //     this.router.navigate(['']);
    //
    //     console.log(this.dataService.user);
    //
    //     return;*/
    //   }).catch(error => {
    //     this.registerError = "Username or Email is already in use!";
    //   });

  }

  ngOnInit(): void {
  }

}
