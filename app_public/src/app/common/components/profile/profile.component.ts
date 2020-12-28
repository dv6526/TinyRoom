import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/models/user';
import { DataService } from "../../services/data.service";
import { ProfileInfoDto } from "../../classes/DTOs/profile-info-dto";
import { PasswordDto } from "../../classes/DTOs/password-dto";
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
  ) { }

  public user: User;
  public modalPassw: boolean = false;
  public modalTerminate: boolean = false;
  public modalProfile: boolean = false;

  public profileInfo: ProfileInfoDto = {
    profile_picture: "",
    chosen_skin: "",
    bio_title: "",
    bio: ""
  };

  public newPassword: PasswordDto = {
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

    if (this.checkPassword()) {
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

  public onClickConfirmPassword(event: MouseEvent): void {
    this.changePassword();
    this.modalPassw = false;
  }

  public onClickConfirmTerminate(event: MouseEvent): void {
    this.terminateAccount();
    this.modalTerminate = false;
  }

  public onClickConfirmUpdate(event: MouseEvent): void {
    this.updateProfile();
    this.modalProfile = false;
  }

  public onClickDeny(event: MouseEvent): void {
    this.modalPassw = false;
    this.modalTerminate = false;
    this.modalProfile = false;
  }

  public terminateAccount(): void {
    this.dataService.terminateAccount(this.user._id)
      .then(response => {
        console.log("Account has been terminated!");
        this.terminateMessage = "Account has been terminated!";
        this.cookieService.deleteAll();
        this.router.navigate(['']);
      })
      .catch(error => this.terminateMessage = error);
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

  private getComponentName(): string {
    return "ProfileComponent";
  }

  ngOnInit(): void {
    this.user = this.dataService.user;
  }
}
