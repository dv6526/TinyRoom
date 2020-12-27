import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFahrenheit'
})
export class ToFahrenheitPipe implements PipeTransform {

  transform(value: string): string {
    // get the number of °C
    let celsius: number = parseInt(value.split(" ")[0], 10);
    // to fahrenheit
    let fahrenheit: number = Math.round((celsius-32) * (5/9));
    return value + " | " + fahrenheit + " °F";
  }

}
