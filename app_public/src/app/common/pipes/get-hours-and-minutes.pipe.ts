import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getHoursAndMinutes'
})
export class GetHoursAndMinutesPipe implements PipeTransform {

  transform(date: Date): string {
    let temp = new Date(date);
    return temp.getHours() + ":" + temp.getMinutes();
  }

}
