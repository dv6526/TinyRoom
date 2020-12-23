import { Pipe, PipeTransform } from '@angular/core';
import { CookieService } from "ngx-cookie-service";

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  constructor(
    private cookieService: CookieService
  ) {}

  transform(username: string): string {
    if(username.length > 13)
      return username.slice(0,10) + "...";
    else
      return username;
  }

}
