import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/user';
import { DataService } from "../../services/data.service";
import { ProfileInfo} from "../../classes/profile-info";
import { Password } from "../../classes/password";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  public user: User;

  public profileInfo: ProfileInfo;

  public newPassword: Password = {
    password: ""
  };

  public changePasswordMessage: string;

  public updateProfileMessage: string;

  public terminateMessage: string;

  public checkPassword(): boolean {
    const regPass = /^.{3,}$/;
    if (!regPass.test(this.newPassword.password)) {
      return false;
    } else {
      return true;
    }
  }

  public changePassword(): void {
    if(this.checkPassword()) {
      this.dataService.changePassword(this.user._id, this.newPassword)
        .then(response => {
          // update data
          this.user = response;
          this.dataService.user = this.user;
          this.changePasswordMessage = "Password is changed."
        })
        .catch(error => this.changePasswordMessage = error);
    } else {
      this.changePasswordMessage = "Password is too short!";
    }
  }

  public terminateAccount(): void {
    this.dataService.terminateAccount(this.user._id)
      .then(response => {
        this.terminateMessage = "Account has been terminated!";
        this.cookieService.deleteAll();
        this.router.navigate(['']);
      })
      .catch(error => this.terminateMessage = error);
    console.log("Account has been terminated!");
  }

  public updateProfile(): void {
    // DTO
    this.profileInfo.profile_picture = this.user.profile_picture;
    this.profileInfo.chosen_skin = this.user.chosen_skin;
    this.profileInfo.bio_title = this.user.bio_title;
    this.profileInfo.bio = this.user.bio;

    this.dataService.updateProfile(this.user._id, this.profileInfo)
      .then(response => {
        // update data
        this.user = response;
        this.dataService.user = this.user;
        this.updateProfileMessage = "Profile info is UPDATED.";
        console.log("Profile info is updated!");
      })
      .catch(error => this.updateProfileMessage = error);
  }

  ngOnInit(): void {
    this.user = this.dataService.user;
  }
}
