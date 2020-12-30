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

  public profilePicture: File;
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

  public checkPassThenModal(): void {
    if(this.checkPassword())
      this.modalPassw = true;
    else {
      this.modalPassw = false;
      this.changePasswordMessage = "Password is too short!";
    }
  }

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
      this.changePasswordMessage = "Please wait: Changing your password.";
      this.dataService.changePassword(this.user._id, this.newPassword)
        .then(response => {
          // update data
          this.dataService.zeton = response['zeton'];
          this.cookieService.set('token', response['zeton']);
          console.log("token is " + this.dataService.zeton);
          this.changePasswordMessage = "Password is changed."
        })
        .catch(error => {
          this.changePasswordMessage = "Could not change the password!";
          //this.changePasswordMessage = error.message
        });
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
    this.terminateMessage = "Please wait: Terminating your account.";
    this.dataService.terminateAccount(this.user._id)
      .then(response => {
        console.log("Account has been terminated!");
        this.terminateMessage = "Account has been terminated!";
        this.cookieService.deleteAll();
        this.router.navigate(['']);
      })
      .catch(error => {
        this.terminateMessage = "Could not terminate the account!";
        // this.terminateMessage = error.message
      });
  }

  public selectFile(files: FileList): void {
    this.profilePicture = files.item(0);
  }

  public updateProfile(): void {
    this.updateProfileMessage = "Please wait: Updating your profile.";
    this.dataService.updateProfile(this.user._id, this.profileInfo, this.profilePicture)
      .then(response => {
        // update data
        this.user = response;
        this.dataService.user = this.user;
        this.updateProfileMessage = "Profile info is UPDATED.";
        console.log("Profile info is updated!");
      })
      .catch(error => {
        this.updateProfileMessage = "Could not update the profile!";
        // if(error.status == 0)
        //   this.updateProfileMessage = "No internet connection";
        // else
        //   this.updateProfileMessage = error.message
      });
  }

  private getComponentName(): string {
    return "ProfileComponent";
  }

  ngOnInit(): void {
    this.user = this.dataService.user;
    // DTO
    this.profileInfo.profile_picture = "";
    this.profileInfo.chosen_skin = this.user.chosen_skin;
    this.profileInfo.bio_title = this.user.bio_title;
    this.profileInfo.bio = this.user.bio;
  }
}
