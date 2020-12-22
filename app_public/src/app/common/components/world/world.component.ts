import { Component, OnInit } from '@angular/core';

import { Weather } from "../../classes/weather";
import { DataService } from "../../services/data.service";
import { WeatherService } from "../../services/weather.service";
import { GeoLocationService } from "../../services/geo-location.service";
import { CookieService } from "ngx-cookie-service";

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
  ) {}

  public weather: Weather[];

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
        this.weatherService.weather = weather;
        // save to cookies
        this.cookieService.set('weather', JSON.stringify(weather));
        let date = new Date();
        console.log(date.getDate() + " " + date.getMonth() + " " + date.getFullYear());
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

  // Start script  (socket)
  public loadStartGameScript() {
    let body: any = <HTMLDivElement>document.body;
    let script: any = document.createElement('script');
    script.innerHTML = 'newStart();';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
    body.removeChild(script);
  }

  ngOnInit(): void {
    if(this.weatherService.weather == null) {
      let date = new Date();
      // if weather is not cookied or if weather is from yesterday
      if (this.cookieService.get('weather') == "" || this.cookieService.get('weather') == "" || this.cookieService.get('weatherAquireDate') != (date.getDate() + "." + date.getMonth() + "." + date.getFullYear())) {
        this.getGeoLocation();
      } else {
        this.weather = JSON.parse(this.cookieService.get("weather"));
        this.weatherService.weather = this.weather;
      }
    } else {
      this.weather = this.weatherService.weather;
    }

    this.loadStartGameScript();
  }
}
