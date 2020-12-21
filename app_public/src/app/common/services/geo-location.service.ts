import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {

  constructor() { }

  public message: string = "";

  public getLocation(success, error, noLocation): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      noLocation();
    }
  }
}
