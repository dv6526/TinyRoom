import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/user';
import { DataService } from "../../services/data.service";
import { ProfileInfo} from "../../classes/profile-info";
import { Password } from "../../classes/password";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private dataService: DataService, private cookieService: CookieService) {
  }

  public user: User; /*= {
    username: "",
    rank: "",
    email: "",
    password: "",
    profile_picture: "",
    bio_title: "",
    bio: "",
    chosen_skin: "",
    _id: ""
  };*/

  public newPassword: Password = {
    password: ""
  };

  public profileInfo: ProfileInfo = {
    profile_picture: "",
    bio_title: "",
    bio: "",
    chosen_skin: ""
  }

  public changePasswordMessage: string;
  public updateProfileMessage: string;
  public terminateMessage: string;

  private getUserData(): void {
    // pricakujemo samo en zadetek (ali nobenega) zato iz tabele vzamemo prvi element
    this.dataService.getUserData(this.cookieService.get('user'), this.cookieService.get('password')).then(foundUser => {
      this.user = foundUser[0]
      this.profileInfo.profile_picture = this.user.profile_picture;
      this.profileInfo.bio_title = this.user.bio_title;
      this.profileInfo.bio = this.user.bio;
      this.profileInfo.chosen_skin = this.user.chosen_skin;
    });
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
    if(this.checkPassword()) {
      this.dataService.changePassword(this.user._id, this.newPassword).then(response => this.changePasswordMessage = "Password is changed.").catch(error => this.changePasswordMessage = error);
    } else {
      this.changePasswordMessage = "Password is too short!";
    }
  }

  public terminateAccount(): void {
    this.dataService.terminateAccount(this.user._id).then(response => this.terminateMessage = "Treba brisati piškotke!"/*deleteCookies oziroma brisi avtorizacijo */).catch(error => this.terminateMessage = error);
    console.log("terminateAccount");
  }

  public updateProfile(): void {
    this.dataService.updateProfile(this.user._id, this.profileInfo).then(response => this.updateProfileMessage = "Profile info is UPDATED.").catch(error => this.updateProfileMessage = error);
  }

  ngOnInit(): void {
    this.getUserData();
  }
}
