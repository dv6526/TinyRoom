import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../classes/user';
import { environment } from "../../../environments/environment";
import { ProfileInfo } from "../classes/profile-info";
import { Password } from "../classes/password";
import { Room } from "../classes/room";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;
  public user: User;
  public room: Room;

  public getUserData(username: string, password: string): Promise<User[]> {
    const url: string = `${this.apiUrl}/uporabniki`;
    return this.http
      .get(url, {params: {username: username, password: password}})
      .toPromise()
      .then(response => response as User[])
      .catch(this.processException);
  }

  public changePassword(userId:string, newPassword: Password): Promise<User> {
    const url: string = `${this.apiUrl}/profile/${userId}/password`;
    return this.http
      .put(url, newPassword)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public terminateAccount(userId:string): Promise<any> {
    const url: string = `${this.apiUrl}/profile/${userId}`;
    return this.http
      .delete(url)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public updateProfile(userId:string, newInfo: ProfileInfo): Promise<User> {
    const url: string = `${this.apiUrl}/profile/${userId}/info`;
    return this.http
      .put(url, newInfo)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public getFurnitureLocation(username:string): Promise<any> {
    const url: string = `${this.apiUrl}/privateRoom/${username}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public updatePrivateRoom(username:string, furniture: any): Promise<any> {
    const url: string = `${this.apiUrl}/privateRoom/${username}`;
    return this.http
      .post(url, furniture)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public createNewUser(email:string, username:string, password:string, rank:string): Promise<any> {
    let newUser: User = {
      username : username,
      rank: rank,
      email: email,
      password: password,
      profile_picture: "",
      bio_title: "",
      bio: "",
      chosen_skin: "",
      _id: "",
    }
    const url: string = `${this.apiUrl}/uporabniki/`;
    return this.http
      .post(url, newUser)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  private processException(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka.message || napaka);
  }
}
