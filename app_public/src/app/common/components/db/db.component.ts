import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { User } from "../../classes/models/user";
import { CookieService } from "ngx-cookie-service";

import dataUser from "../../../../assets/models/uporabnik.js";
import dataMessages from "../../../../assets/models/sporocila.js";
import {UserDto} from "../../classes/DTOs/user-dto";
import {Message} from "../../classes/models/message";

@Component({
  selector: 'app-db',
  templateUrl: './db.component.html',
  styleUrls: ['./db.component.css']
})
export class DbComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private cookieService: CookieService
  ) { }

  public deleteMessage: string;
  public addMessage: string;
  public addMessagesMessage: string;
  public progress: string;

  public dbDeleteAll(): void {
    this.addMessage = "";
    this.addMessagesMessage = "";
    this.addMessage = "";
    this.dataService.dbDeleteAll()
      .then(response => {
        this.dataService.user = null;
        this.cookieService.deleteAll();
        this.deleteMessage = "Database is clean!";
        console.log("Database is clean!");
        console.log("Api says: " + JSON.stringify(response));
      })
      .catch(error => {
        this.deleteMessage = "Something went wrong with deleting database!";
        console.log("Something went wrong with deleting database!");
      });
  }

  public dbAddEntries(): void {
    this.deleteMessage = "";
    this.addMessagesMessage = "";
    this.addMessage = "";
    const upor: any = dataUser;
    const u: UserDto[] = upor.uporabnik;
    for(let i=0;i<u.length;i++) {
      this.dataService.dbAddEntries(u[i])
        .then(response => {
          console.log("Successfully added user: " + u[i].username);
          this.addMessage = "Users imported successfully!";
        })
        .catch(error => {
          this.addMessage = "Something went wrong with adding predefined users into database!";
          console.log("Something went wrong with adding predefined users into database: " + error);
        });
    }
  }

  public dbAddMessages(): void {
    this.deleteMessage = "";
    this.addMessage = "";
    const spor: any = dataMessages;
    const u: Message[] = spor.sporocilo;

    for(let i=0;i<u.length;i++) {
      this.dataService.dbAddMessageEntries(u[i])
        .then(response => {
          console.log("Successfully imported message: " + u[i].body);
          this.progress = "Message " + (i+1) + " imported successfully!";
        })
        .catch(error => {
          this.addMessagesMessage = "Something went wrong with adding predefined messages into database!";
          console.log("Something went wrong with adding predefined messages into database: " + error);
        });
    }
    this.addMessagesMessage = "Messages imported successfully!";
  }

  private getComponentName(): string {
    return "DbComponent";
  }

  ngOnInit(): void {
  }

}
