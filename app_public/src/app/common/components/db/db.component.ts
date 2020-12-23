import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { User } from "../../classes/models/user";
import { CookieService } from "ngx-cookie-service";
import data from "../../../../assets/models/uporabnik.js";

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

  public dbDeleteAll(): void {
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
    const upor: any = data;
    const u: User[] = upor.uporabnik;
    for(let i=0;i<u.length;i++) {
      this.dataService.dbAddEntries(u[i])
        .then(response => {
          console.log("Successfully added user: " + u[i].username);
          this.addMessage = "Users imported successfully!";
        })
        .catch(error => {
          this.addMessage = "Something went wrong with adding predefined entries into database!";
          console.log("Something went wrong with adding predefined entries into database: " + error);
        });
    }
  }

  private getComponentName(): string {
    return "DbComponent";
  }

  ngOnInit(): void {
  }

}
