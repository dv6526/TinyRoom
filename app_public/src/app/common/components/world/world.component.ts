import { Component, OnInit } from '@angular/core';

import { Weather } from "../../classes/weather";
import { DataService } from "../../services/data.service";
import { WeatherService } from "../../services/weather.service";
import { GeoLocationService } from "../../services/geo-location.service";
import { CookieService } from "ngx-cookie-service";
import {timeout} from "rxjs/operators";
import {Observable, timer} from "rxjs";
import { User } from "../../classes/user";
import { Chat } from "../../classes/chat";

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent implements OnInit {

  constructor(
    private weatherService: WeatherService,
    private geoLocationService: GeoLocationService,
    private dataService: DataService,
    public cookieService: CookieService
  ) {}

  public user: User;

  public chat: Chat;

  public weather: Weather[];
  public message: string;

  private body: any = <HTMLDivElement>document.body;
  public script: any = document.createElement('script');

  // Weather
  private getWeatherData = (position: any): void => {
    this.message = "Gathering weather information.";
    const lat: string = position.coords.latitude;
    const lng: string = position.coords.longitude;
    this.weatherService
      .getWeatherData(lat, lng)
      .then(weather => {
        this.message = weather.length > 0 ? "" : "Something went south with gathering weather information.";
        this.weather = weather;
        this.weatherService.weather = weather;
      });
  }

  private showError = (error: any): void => {
    this.message = error.message;
  }

  private noLocation = (): void => {
    this.message = "Geolocation is not supported by your web browser.";
  }

  private getGeoLocation = (): void => {
    this.message = "Gathering current client geolocation information.";
    this.geoLocationService.getLocation(
      this.getWeatherData,
      this.showError,
      this.noLocation
    );
  }

  // Start script  (socket)
  public loadStartGameScript() {
    //console.log(this.cookieService.get('sprite_idx'));
    if(this.cookieService) {
      //console.log(this.cookieService.get('user'));
      //console.log("-- sem tukajle");
      //this.script.innerHTML = 'let username="' + this.cookieService.get('user') + '";' + 'const sprite_idx = "' + this.cookieService.get("sprite_idx") + '";' + 'let my_id = "' + this.cookieService.get("my_id") + '";' + 'const weather = "clear sky";' + 'const rank = "' + this.cookieService.get("rank") + '";console.log("skripta"); newStart();';
      this.script.innerHTML = 'newStart();';
      this.script.async = true;
      this.script.defer = true;
      this.body.appendChild(this.script);
    } else {
      console.log("100ms timeout");
      // ce bo kdaj error bo zarad tega timeOuta
      setTimeout(this.loadStartGameScript,100);
    }
  }
  // Clean after yourself
  public cleanScript() {
   this.body.removeChild(this.script);
  }

  ngOnInit(): void {
    if(this.weatherService.weather == null)
      this.getGeoLocation();
    else
      this.weather = this.weatherService.weather;
    this.loadStartGameScript();
    //this.chat = new Chat('tinyroom', this.cookieService);
  }

  ngDoCheck(): void {
    // grdo ampak deluje
    if(this.user != this.dataService.user) {
      this.user = this.dataService.user;
      this.loadStartGameScript();
    }
  }

  ngOnDestroy(): void {
    this.cleanScript();
  }

}
