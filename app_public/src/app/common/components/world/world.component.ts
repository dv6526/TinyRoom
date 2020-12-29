import { Component, OnInit } from '@angular/core';

import { Weather } from "../../classes/other/weather";
import { DataService } from "../../services/data.service";
import { WeatherService } from "../../services/weather.service";
import { GeoLocationService } from "../../services/geo-location.service";
import { CookieService } from "ngx-cookie-service";
import { User } from "../../classes/models/user";

declare const setUserData: any;
declare const newStart: any;

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
    private cookieService: CookieService
  ) { }

  public weather: Weather[];
  public user: User;

  public message: string;

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
        let skins: any = { "bunny": 0, "goat": 1, "rat": 2 };
        //setUserData(this.user.username, skins[this.user.chosen_skin], this.user._id, this.weather[0].description, this.user.rank);
        this.weatherService.weather = weather;
        // save to cookies
        this.cookieService.set('weather', JSON.stringify(weather));
        let date = new Date();
        this.cookieService.set('weatherAquireDate', date.getDate() + "." + date.getMonth() + "." + date.getFullYear());
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

  private getComponentName(): string {
    return "WorldComponent";
  }

  // Start script  (socket)
  public startTheWorld() {
    // "script.js" call
    let u: User = this.dataService.user
    //let skins: any = { "bunny": 0, "goat": 1, "rat": 2 };
    //let sprite_idx: string = "";
    //if (this.weather)
    //  sprite_idx = this.weather[0].icon_string;
    //console.log("spriteidx: " + sprite_idx);
    setUserData(this.dataService.zeton);
    //sprite_idx = skins[sprite_idx];
    newStart();
  }

  ngOnInit(): void {
    if (this.weatherService.weather == null) {
      let date = new Date();
      // if weather is not cookied or if weather is from yesterday
      if (this.cookieService.get('weather') == "" || this.cookieService.get('weatherAquireDate') != (date.getDate() + "." + date.getMonth() + "." + date.getFullYear())) {
        this.getGeoLocation();
      } else {
        this.weather = JSON.parse(this.cookieService.get("weather"));
        this.weatherService.weather = this.weather;
      }
    } else {
      this.weather = this.weatherService.weather;
    }

    this.startTheWorld();
  }
}
