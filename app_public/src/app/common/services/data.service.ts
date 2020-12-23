import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../classes/models/user';
import { environment } from "../../../environments/environment";
import { ProfileInfoDto } from "../classes/DTOs/profile-info-dto";
import { PasswordDto } from "../classes/DTOs/password-dto";
import { PrivateRoom } from "../classes/models/privateRoom";
import { UserDto } from "../classes/DTOs/user-dto";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;
  public user: User;
  public room: PrivateRoom;

  public getUserData(username: string, password: string): Promise<User[]> {
    const url: string = `${this.apiUrl}/uporabniki`;
    return this.http
      .get(url, {params: {username: username, password: password}})
      .toPromise()
      .then(response => response as User[])
      .catch(this.processException);
  }

  public changePassword(userId:string, newPassword: PasswordDto): Promise<User> {
    const url: string = `${this.apiUrl}/profile/${userId}/password`;
    return this.http
      .put(url, newPassword)
      .toPromise()
      .then(response => response as User)
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

  public updateProfile(userId:string, newInfo: ProfileInfoDto): Promise<User> {
    const url: string = `${this.apiUrl}/profile/${userId}/info`;
    return this.http
      .put(url, newInfo)
      .toPromise()
      .then(response => response as User)
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

  public updatePrivateRoom(username:string, furniture: any): Promise<User> {
    const url: string = `${this.apiUrl}/privateRoom/${username}`;
    return this.http
      .post(url, furniture)
      .toPromise()
      .then(response => response as User)
      .catch(this.processException);
  }

  public createNewUser(newUser: UserDto): Promise<User> {
    const url: string = `${this.apiUrl}/uporabniki/`;
    return this.http
      .post(url, newUser)
      .toPromise()
      .then(response => response as User)
      .catch(this.processException);
  }

  public dbDeleteAll(): Promise<any> {
    const url: string = `${this.apiUrl}/db/deleteAll/`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public dbAddEntries(newUser: UserDto): Promise<User> {
    return this.createNewUser(newUser);
  }

  private processException(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka.message || napaka);
  }
}
