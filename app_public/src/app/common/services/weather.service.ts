import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Weather } from "../classes/weather";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  public weather: any[];

  public getWeatherData(lat: string, lng: string): Promise<Weather[]> {
    //let latitude: string = "45.853760";
    //let longitude: string = "15.384120";
    //longitude = "14.5058";
    //latitude = "46.0569";

    const url: string = "https://api.openweathermap.org/data/2.5/onecall";
    return this.http
      .get(url, {params: {lat: lat, lon: lng, units: 'metric', lang: '-sl',exclude : 'current,minutely,hourly,alerts', appid: 'd62b2d57190388b445a9b96264ba0e44'}})
      .toPromise()
      .then(response => this.formatWeatherData(response) as Weather[])
      .catch(this.processException);
  }

  public formatWeatherData(data:any): Weather[] {
    let days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let weather7: any[] = [];
    let myArray: any = data.daily;
    myArray.pop();
    myArray.forEach((val, index, array) => {
      let d: Date = new Date(val.dt * 1000);
      let dayName: any = days[d.getDay()];
      let day: any = {};
      day.id = "day" + (index+1);
      day.day =  dayName;
      day.icon = val.weather[0].icon;
      day.icon_string = val.weather[0].main;
      day.temperature = Math.round(val.temp.day) + ' °C';
      weather7.push(day);
    });
    return weather7;
  }

  private processException(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka.message || napaka);
  }
}
