import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";


import { User } from '../classes/models/user';
import { environment } from "../../../environments/environment";
import { ProfileInfoDto } from "../classes/DTOs/profile-info-dto";
import { PasswordDto } from "../classes/DTOs/password-dto";
import { PrivateRoom } from "../classes/models/privateRoom";
import { UserDto } from "../classes/DTOs/user-dto";
import { Message } from "../classes/models/message";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

  private apiUrl = environment.apiUrl;
  public zeton: string;
  public user: any;
  public room: PrivateRoom;

  public loginUser(username: string, password: string): Promise<any> {
    const url: string = `${this.apiUrl}/prijava`;
    return this.http
      .post(url, { username: username, password: password })
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public changePassword(userId: string, newPassword: PasswordDto): Promise<User> {
    const url: string = `${this.apiUrl}/uporabniki/${userId}/password`;
    const token = this.cookieService.get('token');
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http
      .put(url, newPassword, httpLastnosti)
      .toPromise()
      .then(response => response as User)
      .catch(this.processException);
  }

  public terminateAccount(userId: string): Promise<any> {
    const token = this.cookieService.get('token');
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    const url: string = `${this.apiUrl}/uporabniki/${userId}`;
    return this.http
      .delete(url, httpLastnosti)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public updateProfile(userId: string, newInfo: ProfileInfoDto, profilePicture: File): Promise<User> {
    const formData: FormData = new FormData();
    formData.append('bio_title', newInfo.bio_title);
    formData.append('bio', newInfo.bio);
    formData.append('chosen_skin', newInfo.chosen_skin);
    formData.append('profile_picture', newInfo.profile_picture);
    if (profilePicture) {
      formData.append('pfp', profilePicture, profilePicture.name);
      formData.append('profile_picture', profilePicture.name);
      console.log(profilePicture.name);
    }

    const token = this.cookieService.get('token');
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    const url: string = `${this.apiUrl}/uporabniki/${userId}/info`;
    return this.http
      .put(url, formData, httpLastnosti)
      .toPromise()
      .then(response => response as User)
      .catch(this.processException);
  }

  public getFurnitureLocation(username: string): Promise<any> {
    const url: string = `${this.apiUrl}/privateRoom/${username}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public updatePrivateRoom(username: string, furniture: any): Promise<User> {
    const token = this.cookieService.get('token');
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    const url: string = `${this.apiUrl}/privateRoom/${username}`;
    return this.http
      .post(url, furniture, httpLastnosti)
      .toPromise()
      .then(response => response as User)
      .catch(this.processException);
  }

  public createNewUser(newUser: UserDto): Promise<any> {
    const url: string = `${this.apiUrl}/registracija/`;
    return this.http
      .post(url, newUser)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public dbDeleteAll(): Promise<any> {
    const token = this.cookieService.get('token');
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    const url: string = `${this.apiUrl}/db`;
    return this.http
      .delete(url, httpLastnosti)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public dbAddEntries(newUser: UserDto): Promise<User> {
    return this.createNewUser(newUser);
  }

  public dbAddMessageEntries(newMessage: Message): any {
    const url: string = `${this.apiUrl}/chatlogs/`;
    return this.http
      .post(url, newMessage)
      .toPromise()
      .then(response => response as any)
      .catch(this.processException);
  }

  public getMessages(userId: string, date: string, currentPage: number, perPage: number): Promise<Message[]> {
    const token = this.cookieService.get('token');
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    const url: string = `${this.apiUrl}/messages`;
    return this.http
      .get(url, { headers: httpLastnosti.headers, params: { id: userId, date: date, page: currentPage.toString(), perPage: perPage.toString() }})
      .toPromise()
      .then(response => response as Message[])
      .catch(this.processException);
  }

  public setAdmin(userId: string, newAdmin: string): Promise<User> {
    const token = this.cookieService.get('token');
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    const url: string = `${this.apiUrl}/uporabniki/${newAdmin}/rank`;
    return this.http
      .put(url, null,{headers: httpLastnosti.headers, params: {id: userId}})
      .toPromise()
      .then(response => response as User)
      .catch(this.processException);
  }

  public dbSetAdmin(newAdmin: string): Promise<User> {
    const url: string = `${this.apiUrl}/db/${newAdmin}/rank`;
    return this.http
      .put(url, null)
      .toPromise()
      .then(response => response as User)
      .catch(this.processException);
  }

  private processException(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka);
  }
}
